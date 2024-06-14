import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Music, MusicSchema } from './entities/music.entity';
import { DropboxModule } from 'src/dropbox/dropbox.module';

@Module({
  controllers: [MusicController],
  providers: [MusicService],
  imports: [
    DropboxModule,
    MongooseModule.forFeature([
      {
        name: Music.name,
        schema: MusicSchema,
      },
    ]),
  ],
})
export class MusicModule {}
