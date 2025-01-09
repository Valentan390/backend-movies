import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import * as createHttpError from 'http-errors';

export const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(createHttpError(404, `${id} is not a valid ID`));
  }

  next();
};
