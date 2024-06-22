import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  ConflictException,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from 'types/file.types';
import { DriveService } from 'src/drive/drive.service';
import { GenreService } from 'src/genre/genre.service';
import { AuthorService } from 'src/author/author.service';
import { MUSIC_IS_EXISTS } from 'consts/music.consts';

@Controller('music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
    private readonly driveService: DriveService,
    private readonly genreService: GenreService,
    private readonly authorService: AuthorService,
  ) {}

  @UseInterceptors(
    FileInterceptor('music', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(mp3)$/)) cb(null, true);
        else {
          cb(new BadRequestException('LIMIT_UNEXPECTED_FILE', 'music'), false);
        }
      },
    }),
  )
  @Post()
  async create(
    @Body() createMusicDto: CreateMusicDto,
    @UploadedFile()
    music: FileType,
  ) {
    const musicInDb = await this.musicService.findOneByName(
      createMusicDto.name,
    );
    if (musicInDb)
      throw new ConflictException(MUSIC_IS_EXISTS(createMusicDto.name));
    const musicData = { ...createMusicDto };
    if (!createMusicDto.name) {
      musicData.name = music.originalname.split('.')[0];
    }

    if (createMusicDto.genre) {
      const genre = await this.genreService.findOneByName(createMusicDto.genre);
      if (genre) musicData.genre = genre._id.toString();
      else {
        const newGenre = await this.genreService.create({
          name: createMusicDto.genre,
        });
        musicData.genre = newGenre._id.toString();
      }
    }

    if (createMusicDto.author) {
      const author = await this.authorService.findOneByName(
        createMusicDto.author,
      );
      if (author) musicData.author = author._id.toString();
      else {
        const newAuthor = await this.authorService.create({
          name: createMusicDto.author,
        });
        musicData.author = newAuthor._id.toString();
      }
    }

    const MusicURL = await this.driveService.uploadAudio(music);
    return this.musicService.create({ ...musicData, url: MusicURL });
  }

  @Get()
  findAll() {
    return this.musicService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.musicService.findOneByName(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.updateByName(name, updateMusicDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.musicService.removeByName(name);
  }
}
