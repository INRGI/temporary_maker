import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from '@epc-services/gdrive-api';
import { Injectable } from '@nestjs/common';
import { GetSubjectPayload } from './get-subject.payload';
import AdmZip from 'adm-zip';

@Injectable()
export class GetSubjectService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}

  public async getSubject(payload: GetSubjectPayload): Promise<string> {
    const { product, productLift } = payload;
    
    const files = await this.gdriveApiService.searchFileWithQuery(
      `name contains '${product} ${productLift} SL' and mimeType = 'application/vnd.google-apps.document'`,
      10
    );

    if (!files.files.length) {
      return 'Subject not found';
    }

    try {
      const fileBuffer = await this.gdriveApiService.getContentLikeBuffer(
        files.files[0].id,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
  
      if (!Buffer.isBuffer(fileBuffer)) {
        throw new Error('Invalid file format. Expected Buffer.');
      }
  
      const text = this.extractTextFromDocx(fileBuffer);
      return text || 'No text found in document';
    } catch (error) {
      return `Error reading file: ${error.message}`;
    }
  }

  private extractTextFromDocx(buffer: Buffer): string {
    try {
      const zip = new AdmZip(buffer);
      const xmlFile = zip.getEntry('word/document.xml');

      if (!xmlFile) {
        throw new Error('document.xml not found in DOCX file');
      }

      const xmlContent = xmlFile.getData().toString('utf8');

      return xmlContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      return 'Error extracting text';
    }
  }
}
