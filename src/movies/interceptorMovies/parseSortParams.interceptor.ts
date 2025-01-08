import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { sortOrderList } from 'src/constans/movies';

@Injectable()
export class ParseSortParamsInterceptor implements NestInterceptor {
  constructor(private readonly sortByList: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { sortOrder, sortBy } = req.query;

    const parsedSortOrder = sortOrderList.includes(sortOrder as string)
      ? sortOrder
      : sortOrderList[0];
    const parsedSortBy = this.sortByList.includes(sortBy as string)
      ? sortBy
      : '_id';

    req.query = {
      ...req.query,
      sortBy: parsedSortBy,
      sortOrder: parsedSortOrder,
    };

    return next.handle();
  }
}
