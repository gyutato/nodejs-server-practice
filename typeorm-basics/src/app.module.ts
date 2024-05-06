import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import {
  AirplaneModel,
  BookModel,
  CarModel,
  ComputerModel,
  SingleBaseModel,
} from './entities/inheritance.entity';
import { ProfileModel } from './entities/profile.entity';
import { PostModel } from './entities/post.entity';
import { TagModel } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeorm',
      entities: [
        UserModel,
        BookModel,
        CarModel,
        SingleBaseModel,
        ComputerModel,
        AirplaneModel,
        ProfileModel,
        PostModel,
        TagModel,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserModel, ProfileModel, PostModel, TagModel]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
