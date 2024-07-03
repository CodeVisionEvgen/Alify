import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  name: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  musics?: string[];
}
