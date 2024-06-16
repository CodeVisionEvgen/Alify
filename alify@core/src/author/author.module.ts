import { Module, forwardRef } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './entities/author.entity';
import { MusicModule } from 'src/music/music.module';
import { MusicService } from 'src/music/music.service';
import { Music, MusicSchema } from 'src/music/entities/music.entity';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService, MusicService],
  exports: [AuthorService],
  imports: [
    forwardRef(() => MusicModule),
    MongooseModule.forFeature([
      {
        schema: AuthorSchema,
        name: Author.name,
      },
      {
        schema: MusicSchema,
        name: Music.name,
      },
    ]),
  ],
})
export class AuthorModule {}
