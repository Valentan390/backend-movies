import { Request } from 'express';
import mongoose from 'mongoose';
import { UserDocument } from 'src/db/schemas/User.schema';

export interface IFilter {
  minReleaseYear?: number;
  maxReleaseYear?: number;
  userId?: mongoose.Types.ObjectId;
}

export interface IGetMoviesParams {
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filter: IFilter;
}

export interface IAddMoviePayload {
  title: string;
  director: string;
  type: string;
  releaseYear?: number;
  userId?: mongoose.Types.ObjectId;
}

export interface IAuthenticatedRequest extends Request {
  user: UserDocument;
}

export interface IPayload {
  username?: string;
  email: string;
  password: string;
}

export interface IRefreshSession {
  sessionId: mongoose.Types.ObjectId;
  refreshToken: string;
}
