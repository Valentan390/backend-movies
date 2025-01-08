import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../db/schemas/Movie.schema';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { handleSaveError, setUpdateSettings } from 'src/db/hooks';
import { AuthMiddleware } from 'src/middleware/authenticate.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Movie.name,
        useFactory: () => {
          // const schema = MovieSchema;
          MovieSchema.post('save', handleSaveError);
          MovieSchema.pre('findOneAndUpdate', setUpdateSettings);
          MovieSchema.post('findOneAndUpdate', handleSaveError);
          return MovieSchema;
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('movies');
  }
}
