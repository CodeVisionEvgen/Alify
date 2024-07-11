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
import * as MusicMetaData from 'music-metadata';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { GENRE_IS_NOT_EXISTS } from 'consts/genre.consts';
import { StringUtilsService } from 'src/string-utils/string-utils.service';
@Controller('music')
export class MusicController {
  BASE_MUSIC_THUMB: string;
  constructor(
    private readonly musicService: MusicService,
    private readonly driveService: DriveService,
    private readonly genreService: GenreService,
    private readonly authorService: AuthorService,
    private readonly imageKitService: ImagekitService,
    private readonly stringUtilsService: StringUtilsService,
  ) {
    this.BASE_MUSIC_THUMB =
      'https://ik.imagekit.io/sujkmwsrb/thumbs/pngegg.png?updatedAt=1719249303422';
  }

  @UseInterceptors(
    FileInterceptor('music', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(mp3)$/)) cb(null, true);
        else {
          cb(new BadRequestException('File must to be mp3', 'music'), false);
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
    const musicData = { ...createMusicDto };
    if (!createMusicDto.name) {
      let splitedName = [];
      try {
        splitedName = decodeURIComponent(escape(music.originalname)).split('.');
      } catch (error) {
        splitedName = music.originalname.split('.');
      }
      const name = splitedName.filter((e) => e !== 'mp3').join('');
      musicData.name = this.stringUtilsService.toCapitalize(name);
    }
    const musicInDb = await this.musicService.findOneByName(musicData.name);
    if (musicInDb) throw new ConflictException(MUSIC_IS_EXISTS(musicData.name));

    const metadata = await MusicMetaData.parseBuffer(music.buffer);
    if (createMusicDto.genre) {
      const genre = await this.genreService.findOneByName(createMusicDto.genre);
      if (genre) musicData.genre = genre._id.toString();
      else {
        const newGenre = await this.genreService.create({
          name: createMusicDto.genre,
        });
        musicData.genre = newGenre._id.toString();
      }
    } else if (metadata.common.genre) {
      const GenreInDb = await this.genreService.findOneByName(
        metadata.common.genre[0],
      );
      if (!GenreInDb) {
        const newGenre = await this.genreService.create({
          name: metadata.common.genre[0],
        });
        musicData.genre = newGenre._id.toString();
      } else {
        musicData.genre = GenreInDb._id.toString();
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
    } else {
      const authorByMetadata = await this.authorService.findOneByName(
        metadata.common.artist,
      );
      if (authorByMetadata) musicData.author = authorByMetadata._id.toString();
      else if (metadata.common.artist) {
        const newAuthor = await this.authorService.create({
          name: metadata.common.artist,
        });
        musicData.author = newAuthor._id.toString();
      }
    }
    if (metadata.common.picture) {
      musicData.thumbnail = await this.imageKitService.uploadImage(
        metadata.common.picture[0].data,
      );
    } else {
      musicData.thumbnail = this.BASE_MUSIC_THUMB;
    }
    const MusicURL = await this.driveService.uploadAudio(music);
    return this.musicService.create({ ...musicData, url: MusicURL });
  }

  @Get()
  findAll() {
    return this.musicService.findAll();
  }

  @Get('without-genres')
  findWithoutGenres() {
    return this.musicService.findWithoutGenres();
  }

  @Get('/byName/:name')
  findOne(@Param('name') name: string) {
    return this.musicService.findOneByName(name);
  }
  @Get('/byGenre/:genre')
  async findMusicsByGenre(@Param('genre') genre: string) {
    const genreInDb = await this.genreService.findOneByName(genre);
    if (!genreInDb) throw new BadRequestException(GENRE_IS_NOT_EXISTS(genre));
    return this.musicService.findByGenre(genreInDb._id.toString());
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
