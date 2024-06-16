import { Module, forwardRef } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './entities/genre.entity';
import { MusicModule } from 'src/music/music.module';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
  imports: [
    forwardRef(() => MusicModule),
    MongooseModule.forFeature([
      {
        name: Genre.name,
        schema: GenreSchema,
      },
    ]),
  ],
})
export class GenreModule {}
