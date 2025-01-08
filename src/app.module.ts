import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { Connection } from 'mongoose';
import { UsersModule } from './users/users.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    MoviesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get<string>('MONGODB_USER')}:${configService.get<string>('MONGODB_PASSWORD')}@${configService.get<string>('MONGODB_URL')}/${configService.get<string>('MONGODB_DB')}?retryWrites=true&w=majority&appName=Cluster0`,
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () =>
            console.log('Mongodb connection successfully'),
          );
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HomeModule,
  ],
  controllers: [],
})
export class AppModule {}
