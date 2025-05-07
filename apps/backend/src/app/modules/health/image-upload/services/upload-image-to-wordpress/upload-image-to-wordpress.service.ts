import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class UploadImageToWordpressService {
  private readonly logger = new Logger(UploadImageToWordpressService.name);

  async uploadImageFromUrl(imageUrl: string, wordpressUrl: string, username: string, appPassword: string): Promise<string> {
    try {
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = imageResponse.data;
      const imageName = imageUrl.split('/').pop();
      const form = new FormData();
      form.append('file', imageBuffer, imageName);

      const response = await axios.post(`${wordpressUrl}/wp-json/wp/v2/media`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64'),
        },
      });

      return response.data.source_url;
    } catch (error) {
      this.logger.error(`Failed to upload from URL: ${error.message}`);
      return imageUrl;
    }
  }

  async uploadImageFromFile(file: any, wordpressUrl: string, username: string, appPassword: string): Promise<string> {
    try {
      const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        return Buffer.concat(chunks);
      };
  
      const buffer = await streamToBuffer(file.file);
  
      const form = new FormData();
      form.append('file', buffer, {
        filename: file.filename,
        contentType: file.mimetype,
      });
  
      const response = await axios.post(`${wordpressUrl}/wp-json/wp/v2/media`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64'),
        },
      });
  
      return response.data.source_url;
    } catch (error) {
      this.logger.error(`Failed to upload from file: ${error.message}`);
      return '';
    }
  }
}
