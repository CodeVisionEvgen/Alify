import { Module, forwardRef } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Music, MusicSchema } from './entities/music.entity';
import { DriveModule } from 'src/drive/drive.module';
import { AuthorModule } from 'src/author/author.module';
import { GenreModule } from 'src/genre/genre.module';

@Module({
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
  imports: [
    DriveModule,
    forwardRef(() => AuthorModule),
    forwardRef(() => GenreModule),
    MongooseModule.forFeature([
      {
        name: Music.name,
        schema: MusicSchema,
      },
    ]),
  ],
})
export class MusicModule {}
