import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.authorService.findOneByName(name);
  }

  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.updateByName(name, updateAuthorDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.authorService.removeByName(name);
  }
}
