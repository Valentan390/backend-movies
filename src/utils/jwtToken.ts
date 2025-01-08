// import jwt from 'jsonwebtoken';
// import { env } from './env';

// const jwtSecret = env('JWT_SECRET');

// export interface CreateTokenParams {
//   email: string;
// }

// export const createToken = (payload: CreateTokenParams) =>
//   jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

// export const verifyToken = (token: string) => {
//   try {
//     const payload = jwt.verify(token, jwtSecret);
//     return {
//       data: payload,
//       error: null,
//     };
//   } catch (error) {
//     return {
//       error,
//       data: null,
//     };
//   }
// };
