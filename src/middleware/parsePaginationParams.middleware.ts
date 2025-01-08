import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const parseNumber = (number: any, defaultValue: number): number => {
  if (typeof number !== 'string') return defaultValue;

  const parsedNumber = parseInt(number, 10);
  if (Number.isNaN(parsedNumber)) return defaultValue;

  return parsedNumber;
};

@Injectable()
export class ParsePaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { page, perPage } = req.query;

    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);

    req.query = { ...req.query, page: parsedPage, perPage: parsedPerPage };

    next();
  }
}
