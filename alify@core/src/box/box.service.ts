import { Injectable } from '@nestjs/common';
import { FileType } from 'types/file.types';
// @ts-expect-error
import * as BoxSDKNode from 'box-node-sdk';
import BoxClient from 'box-node-sdk/lib/box-client';
@Injectable()
export class BoxService {
  box: BoxSDKNode;
  client: BoxClient;
  constructor() {
    this.box = new BoxSDKNode({
      clientID: process.env.BOX_ID,
      clientSecret: process.env.BOX_KEY,
    });
    this.client = this.box.getBasicClient(process.env.BOX_TOKEN);
  }
  async uploadAudio(file: FileType) {
    return this.client.files.getDownloadURL(
      (await this.client.files.uploadFile('0', file.originalname, file.buffer))
        .entries[0].id,
    );
  }
}
