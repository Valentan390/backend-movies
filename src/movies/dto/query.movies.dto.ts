import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import {
  releaseYearRegexp,
  sortByListMovie,
  sortOrderList,
} from 'src/constans/movies';

export class QueryMoviesDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage: number;

  @IsString()
  @IsIn([...sortByListMovie, '_id'])
  sortBy: string;

  @IsString()
  @IsIn(sortOrderList)
  sortOrder: 'asc' | 'desc';

  @IsOptional()
  @Matches(releaseYearRegexp, {
    message: 'minReleaseYear must be a valid 4-digit year',
  })
  minReleaseYear?: string;

  @IsOptional()
  @Matches(releaseYearRegexp, {
    message: 'maxReleaseYear must be a valid 4-digit year',
  })
  maxReleaseYear?: string;
}
