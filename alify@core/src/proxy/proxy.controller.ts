import { Controller, Get, Param, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { DriveService } from 'src/drive/drive.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly driveService: DriveService) {}
  @Get(':id')
  async stream(@Param('id') id: string, @Res() res: Response) {
    const url = `https://drive.google.com/uc?export=download&id=${id}`;
    const fileSize = (await this.driveService.getAudioSize(id)).data.size;
    const fetchData = async (retryCount = 0) => {
      try {
        const response = await axios.get(url, { responseType: 'stream' });
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', fileSize);
        res.setHeader('Content-Range', `bytes 0-${fileSize}/${fileSize}`);
        response.data.pipe(res).on('error', (err) => {
          console.error('Error piping response:', err);
          res.status(500).send('Error streaming the audio');
        });
      } catch (error) {
        if (retryCount < 3) {
          console.warn(`Retrying fetch for ${url}, attempt #${retryCount + 1}`);
          fetchData(retryCount + 1);
        } else {
          console.error('Error fetching the audio:', error);
          res.status(500).send('Error fetching the audio');
        }
      }
    };

    fetchData();
  }
}
