import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const parseNumber = (value: any, defaultValue: number): number => {
  const parsedNumber = parseInt(value, 10);
  return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};

@Injectable()
export class ParsePaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.query.page = parseNumber(req.query.page, 1);
    req.query.perPage = parseNumber(req.query.perPage, 10);
    return next.handle();
  }
}
