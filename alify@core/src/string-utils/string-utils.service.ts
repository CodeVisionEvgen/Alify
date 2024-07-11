import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilsService {
  toCapitalize(string: string) {
    return string[0].toUpperCase() + string.slice(1, string.length);
  }
}
