import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { releaseYearRegexp, typeList } from 'src/constants/movies';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ versionKey: false, timestamps: true })
export class Movie {
  @Prop({ type: String, required: true })
  @ApiProperty({ example: 'Interstellar', description: 'Movie title' })
  title: string;

  @Prop({ type: String, required: true })
  @ApiProperty({
    example: 'Christopher Nolan',
    description: 'Director of the film',
  })
  director: string;

  @Prop({
    type: String,
    enum: typeList,
    default: 'film',
    required: true,
  })
  @ApiProperty({
    example: 'film',
    description: 'Type of the movie (e.g., film, series, documentary)',
    enum: typeList,
  })
  type: string;

  @Prop({ type: Number, match: releaseYearRegexp })
  @ApiProperty({
    example: 2014,
    description: 'Release year of the movie',
    pattern: releaseYearRegexp.toString(),
  })
  releaseYear: number;

  @Prop({ type: String })
  @ApiProperty({
    example: 'https://example.com/poster.jpg',
    description: 'URL of the movie poster',
  })
  poster: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @ApiProperty({
    example: '60f1b1f1b1f831f1b1f1b1f1',
    description: 'ID of the user who created the movie',
    type: String,
  })
  userId: mongoose.Types.ObjectId;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
