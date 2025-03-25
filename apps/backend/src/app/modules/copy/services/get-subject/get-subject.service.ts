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

    const exactFileName = `${product} ${productLift} SL`;

    const googleDocs = await this.gdriveApiService.searchFileWithQuery(
      `name = '${exactFileName}' and mimeType = 'application/vnd.google-apps.document'`,
      10
    );

    const wordDocs = await this.gdriveApiService.searchFileWithQuery(
      `name = '${exactFileName}' and mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'`,
      10
    );

    let files = {
      files: [...(googleDocs.files || []), ...(wordDocs.files || [])],
    };

    if (!files.files.length) {
      const googleDocsContains =
        await this.gdriveApiService.searchFileWithQuery(
          `name contains '${product} ${productLift} SL' and mimeType = 'application/vnd.google-apps.document'`,
          10
        );

      const wordDocsContains = await this.gdriveApiService.searchFileWithQuery(
        `name contains '${product} ${productLift} SL' and mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'`,
        10
      );

      files = {
        files: [
          ...(googleDocsContains.files || []),
          ...(wordDocsContains.files || []),
        ],
      };
    }

    if (!files.files.length) {
      return 'Subject not found';
    }

    const exactMatch = files.files.find((file) => file.name === exactFileName);
    const fileToUse = exactMatch || files.files[0];

    try {
      let fileBuffer: Buffer;

      if (fileToUse.mimeType === 'application/vnd.google-apps.document') {
        fileBuffer = await this.gdriveApiService.getContentLikeBuffer(
          fileToUse.id,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
      } else {
        fileBuffer = await this.gdriveApiService.getFileAsBuffer(fileToUse.id);
      }

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
      const documentXml = zip.getEntry('word/document.xml');
      if (!documentXml) {
        throw new Error('document.xml not found in DOCX file');
      }
  
      const content = documentXml.getData().toString('utf8');
  
      const paragraphs = content.match(/<w:p[^>]*>.*?<\/w:p>/gs) || [];
  
      const lines: string[] = [];
  
      for (const p of paragraphs) {
        const textMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
  
        const line = textMatches
          .map((match) => match.replace(/<w:t[^>]*>|<\/w:t>/g, ''))
          .join('');
  
        if (line.trim()) {
          lines.push(line.trim());
        }
      }
  
      return lines.join('\n');
    } catch (error) {
      return 'Error extracting text';
    }
  }
}
