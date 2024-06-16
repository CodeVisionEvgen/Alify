import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenreModule } from './genre/genre.module';
import { AuthorModule } from './author/author.module';
import { MusicModule } from './music/music.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoFactoryConf } from 'confs/mongodb.conf';
import { DriveModule } from './drive/drive.module';
import { ProxyModule } from './proxy/proxy.module';
@Module({
  imports: [
    GenreModule,
    forwardRef(() => AuthorModule),
    MusicModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: MongoFactoryConf,
    }),
    DriveModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
