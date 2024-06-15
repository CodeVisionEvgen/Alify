import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Music, MusicSchema } from './entities/music.entity';
import { BoxModule } from 'src/box/box.module';

@Module({
  controllers: [MusicController],
  providers: [MusicService],
  imports: [
    BoxModule,
    MongooseModule.forFeature([
      {
        name: Music.name,
        schema: MusicSchema,
      },
    ]),
  ],
})
export class MusicModule {}
