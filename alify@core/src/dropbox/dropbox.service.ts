import { BadGatewayException, Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { FileType } from 'types/file.types';

@Injectable()
export class DropboxService {
  dropbox: Dropbox;
  constructor() {
    console.log(process.env.DROPBOX_TOKEN);
    this.dropbox = new Dropbox({
      accessToken: process.env.DROPBOX_TOKEN,
    });
  }

  async sendMusic(file: FileType) {
    try {
      return this.dropbox.filesUpload({
        contents: file.buffer,
        path: file.originalName,
        strict_conflict: true,
      });
    } catch (error) {
      throw new BadGatewayException();
    }
  }
}
