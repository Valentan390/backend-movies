import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { startRequestInterval } from './utils/startRequestInterval';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(morgan('combined'));
  app.use(cookieParser());
  const port = process.env.PORT || 3333;

  await app.listen(port, () => console.log(`Server running on ${port} port`));

  startRequestInterval(8 * 60 * 1000);
}
bootstrap();
