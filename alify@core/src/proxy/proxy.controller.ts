import { Controller, Get, Param, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
@Controller('proxy')
export class ProxyController {
  @Get(':id')
  async stream(@Param('id') id: string, @Res() res: Response) {
    const response = await axios.get(
      `https://drive.google.com/uc?export=download&id=${id}`,
      {
        responseType: 'arraybuffer',
      },
    );
    const data = await response.data;
    res.setHeader('Content-Type', 'audio/mp3');
    res.end(data);
  }
}
