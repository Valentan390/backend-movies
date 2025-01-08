import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Movie, MovieDocument } from '../db/schemas/Movie.schema';
import { UpserMovieDto } from './dto/upser- movie.dto';
import { calcPaginationData } from 'src/utils/calcPaginationData';
import { IAddMoviePayload, IGetMoviesParams } from 'src/types/interfase';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async getMovies({
    page,
    perPage: limit,
    sortBy = '_id',
    sortOrder = 'asc',
    filter = {},
  }: IGetMoviesParams) {
    const skip = (page - 1) * limit;
    const moviesQuery = this.movieModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    if (filter.minReleaseYear) {
      moviesQuery.where('releaseYear').gte(filter.minReleaseYear);
    }
    if (filter.maxReleaseYear) {
      moviesQuery.where('releaseYear').lte(filter.maxReleaseYear);
    }
    if (filter.userId) {
      moviesQuery.where('userId').equals(filter.userId);
    }

    const data = await moviesQuery;

    const count = await this.movieModel.countDocuments(moviesQuery.getQuery());

    const paginationData = calcPaginationData({ count, page, perPage: limit });

    return {
      page,
      perPage: limit,
      ...paginationData,
      data,
      count,
    };
  }

  async getMovie(filter: FilterQuery<Movie>): Promise<Movie> {
    return await this.movieModel.findOne(filter);
  }

  async addMovie(payload: IAddMoviePayload): Promise<Movie> {
    return await this.movieModel.create(payload);
  }

  async getMovieById(id: string): Promise<Movie> {
    return await this.movieModel.findById(id).exec();
  }

  async updateMovieById(
    _id: string,
    updateMovieDto: Partial<UpserMovieDto>,
    options = {},
  ): Promise<{ data: Movie; isNew: boolean }> {
    const result = await this.movieModel.findOneAndUpdate(
      { _id },
      updateMovieDto,
      { new: true, includeResultMetadata: true, ...options },
    );

    if (!result || !result.value) {
      throw new NotFoundException(`Movie with id=${_id} not found`);
    }

    return {
      data: result.value,
      isNew: Boolean(result.lastErrorObject.upserted),
    };
  }

  async updateMovie(
    filter: FilterQuery<Movie>,
    payload: UpdateQuery<Movie>,
    options = {},
  ): Promise<{ data: Movie; isNew: boolean } | null> {
    const result = await this.movieModel.findOneAndUpdate(filter, payload, {
      includeResultMetadata: true,
      ...options,
    });

    if (!result || !result.value) {
      throw new NotFoundException(`Movie with id=${filter._id} not found`);
    }

    return {
      data: result.value,
      isNew: Boolean(result.lastErrorObject.upserted),
    };
  }

  async deleteMovieById(_id: string): Promise<Movie> {
    return await this.movieModel.findOneAndDelete({ _id });
  }

  async deleteMovie(filter: FilterQuery<Movie>): Promise<MovieDocument> {
    return this.movieModel.findOneAndDelete(filter);
  }
}
