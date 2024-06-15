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
} from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileType } from 'types/file.types';
import { BoxService } from 'src/box/box.service';

@Controller('music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
    private readonly boxService: BoxService,
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
    const musicData = { ...createMusicDto };
    if (!createMusicDto.name) {
      musicData.name = music.originalname;
    }
    const MusicURL = await this.boxService.uploadAudio(music);
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
