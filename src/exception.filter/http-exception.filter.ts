import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (typeof message === 'object' && message !== null) {
      message = {
        ...(typeof message === 'object' ? message : { message }),
      };
    }

    console.error(`[${request.method}] ${request.url}`, exception);

    response.status(status).json({
      statusCode: status,
      message: message || 'Something went wrong',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
