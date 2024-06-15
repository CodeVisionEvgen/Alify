import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenreModule } from './genre/genre.module';
import { AuthorModule } from './author/author.module';
import { MusicModule } from './music/music.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoFactoryConf } from 'confs/mongodb.conf';
import { BoxModule } from './box/box.module';
@Module({
  imports: [
    GenreModule,
    AuthorModule,
    MusicModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: MongoFactoryConf,
    }),
    BoxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
