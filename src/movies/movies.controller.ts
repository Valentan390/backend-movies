import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpserMovieDto } from './dto/upser- movie.dto';
import { ParsePaginationInterceptor } from '../common/interceptors/ParsePagination.interceptor';
import { ParseSortParamsInterceptor } from '../common/interceptors/parseSortParams.interceptor';
import { sortByListMovie } from 'src/constants/movies';
import { QueryMoviesDto } from './dto/query.movies.dto';
import { parseMoviesFilter } from 'src/utils/parseMoviesFilter';
import { IAuthenticatedRequest, IFilter } from 'src/types/interfase';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { env } from 'src/utils/env';
import { saveFileToCloudinary } from 'src/utils/saveFileToCloudinary';
import { saveFileToUploadsDir } from 'src/utils/saveFileToUploadsDir';
import * as path from 'node:path';
import { ValidateObjectIdPipe } from 'src/common/pipes/ValidateObjectId.pipes';

const enable_cloudinary = env('ENABLE_CLOUDINARY') === 'true';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  @UseInterceptors(ParsePaginationInterceptor)
  @UseInterceptors(new ParseSortParamsInterceptor(sortByListMovie))
  async getMovies(
    @Req() req: IAuthenticatedRequest,
    @Query() query: QueryMoviesDto,
  ) {
    const { _id: userId } = req.user;
    const { page, perPage, sortBy, sortOrder } = query;
    const filter: IFilter = parseMoviesFilter(query);
    filter.userId = userId;

    const data = await this.moviesService.getMovies({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });
    return {
      status: HttpStatus.OK,
      message: 'Successfully fetched movies',
      data,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('poster'))
  async addMovie(
    @Req() req: IAuthenticatedRequest,
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { _id: userId } = req.user;

    let poster = '';

    if (file) {
      if (enable_cloudinary) {
        poster = await saveFileToCloudinary(file);
      } else {
        await saveFileToUploadsDir(file, 'posters');
        poster = path.join('posters', file.filename);
      }
    }

    const data = await this.moviesService.addMovie({
      ...createMovieDto,
      poster,
      userId,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Movie created successfully',
      data,
    };
  }

  @Get(':id')
  async getMovieById(
    @Req() req: IAuthenticatedRequest,
    @Param('id', new ValidateObjectIdPipe()) id: string,
  ) {
    const { _id: userId } = req.user;

    const data = await this.moviesService.getMovie({ _id: id, userId });

    if (!data) {
      throw new NotFoundException(`Movie with id=${id} not found`);
    }

    return {
      status: HttpStatus.OK,
      message: `Movie with id=${id} fetched successfully`,
      data,
    };
  }

  @Put(':id')
  async upsertMovie(
    @Req() req: IAuthenticatedRequest,
    @Param('id', new ValidateObjectIdPipe()) id: string,
    @Body() upserMovieDto: UpserMovieDto,
  ) {
    const { _id: userId } = req.user;

    const { data, isNew } = await this.moviesService.updateMovie(
      { _id: id, userId },
      { ...upserMovieDto, userId },
      {
        upsert: true,
      },
    );
    const status = isNew ? HttpStatus.CREATED : HttpStatus.OK;

    return { status, message: 'Movie upserted successfully', data };
  }

  @Patch(':id')
  async patchMovie(
    @Req() req: IAuthenticatedRequest,
    @Param('id', new ValidateObjectIdPipe()) id: string,
    @Body() patchMovieDto: UpserMovieDto,
  ) {
    const { _id: userId } = req.user;

    const result = await this.moviesService.updateMovie(
      { _id: id, userId },
      patchMovieDto,
    );

    if (!result) {
      throw new NotFoundException(`Movie with id=${id} not found`);
    }

    return {
      status: HttpStatus.OK,
      message: 'Movie patched successfully',
      data: result.data,
    };
  }

  @Delete(':id')
  async deleteMovie(
    @Req() req: IAuthenticatedRequest,
    @Param('id', new ValidateObjectIdPipe()) id: string,
  ) {
    const { _id: userId } = req.user;

    const result = await this.moviesService.deleteMovie({ _id: id, userId });

    if (!result) {
      throw new NotFoundException(`Movie with id=${id} not found`);
    }

    return {
      status: HttpStatus.NO_CONTENT,
      message: `Movie with id=${result._id} deleted successfully`,
    };
  }
}
