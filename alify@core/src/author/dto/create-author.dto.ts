import { IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name: string;
}
