// import * as jwt from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';
import { env } from './env';

const jwtSecret = env('JWT_SECRET');

export interface CreateTokenParams {
  email: string;
}

export const createToken = (payload: CreateTokenParams) =>
  sign(payload, jwtSecret, { expiresIn: '24h' });

export const verifyToken = (token: string) => {
  try {
    const payload = verify(token, jwtSecret);
    return {
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      error,
      data: null,
    };
  }
};
