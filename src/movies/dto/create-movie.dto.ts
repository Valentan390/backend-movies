import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { releaseYearRegexp, typeList } from 'src/constants/movies';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  @MinLength(2, { message: 'Title must be at least 2 characters long.' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters.' })
  title: string;

  @IsNotEmpty({ message: 'Director is required.' })
  @IsString({ message: 'Director must be a string.' })
  @MinLength(2, {
    message: 'Director name must be at least 2 characters long.',
  })
  @MaxLength(50, { message: 'Director name must not exceed 50 characters.' })
  director: string;

  @IsNotEmpty({ message: 'Type is required.' })
  @IsString({ message: 'Type must be a string.' })
  @IsIn(typeList, {
    message: `Type must be one of the following: ${typeList.join(', ')}.`,
  })
  type: string;

  @IsOptional()
  @Matches(releaseYearRegexp, {
    message: 'Release year must be a 4-digit number (e.g., 2023).',
  })
  releaseYear?: number;
}
