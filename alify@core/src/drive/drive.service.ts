import { Injectable } from '@nestjs/common';
import { FileType } from 'types/file.types';
import { drive_v3, google } from 'googleapis';
import * as streamifier from 'streamifier';
@Injectable()
export class DriveService {
  drive: drive_v3.Drive;
  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_KEY_FILE_NAME,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    this.drive = google.drive({
      version: 'v3',
      auth,
    });
  }
  async uploadAudio(file: FileType) {
    const stream = streamifier.createReadStream(file.buffer);

    const { id } = (
      await this.drive.files.create({
        requestBody: {
          name: file.originalname,
          parents: [process.env.GOOGLE_DRIVE_FOLDER],
        },
        media: {
          mimeType: file.mimetype,
          body: stream,
        },
      })
    ).data;

    return `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
  }
}
