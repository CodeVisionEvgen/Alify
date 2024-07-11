import { Module, forwardRef } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './entities/genre.entity';
import { MusicModule } from 'src/music/music.module';
import { StringUtilsModule } from 'src/string-utils/string-utils.module';
import { StringUtilsService } from 'src/string-utils/string-utils.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService, StringUtilsService],
  exports: [GenreService],
  imports: [
    StringUtilsModule,
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
