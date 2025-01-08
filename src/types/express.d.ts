import { User } from 'src/db/schemas/User.schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
