import { Controller, Get, Param, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('proxy')
export class ProxyController {
  @Get(':id')
  async stream(@Param('id') id: string, @Res() res: Response) {
    const url = `https://drive.google.com/uc?export=download&id=${id}`;

    const fetchData = async (retryCount = 0) => {
      try {
        const response = await axios.get(url, { responseType: 'stream' });
        res.setHeader('Content-Type', 'audio/mpeg');
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
