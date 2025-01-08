import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { releaseYearRegexp, typeList } from 'src/constans/movies';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ versionKey: false, timestamps: true })
export class Movie {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  director: string;

  @Prop({
    type: String,
    enum: typeList,
    default: 'film',
    required: true,
  })
  type: string;

  @Prop({ type: Number, match: releaseYearRegexp })
  releaseYear: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: mongoose.Types.ObjectId;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
