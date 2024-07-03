import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { IMAGEKIT_MODULE_TOKEN } from './imagekit-config.provider';
import { ImageKitModuleOptions } from './imagekit-config.interface';
import ImageKit from 'imagekit';
import { ReadStream } from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagekitService {
  #imageKit: ImageKit;
  constructor(
    @Inject(IMAGEKIT_MODULE_TOKEN)
    private readonly options: ImageKitModuleOptions,
  ) {
    this.#imageKit = new ImageKit(this.options);
  }
  async uploadImage(image: string | Buffer | ReadStream) {
    const uuid = randomUUID();
    try {
      const imageUploaded = await this.#imageKit.upload({
        file: image,
        fileName: uuid,
        folder: 'thumbs',
      });
      return imageUploaded.url;
    } catch (error) {
      throw new BadGatewayException('Uploading file image failed.');
    }
  }
}
