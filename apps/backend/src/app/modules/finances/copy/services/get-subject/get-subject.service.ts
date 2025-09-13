/* eslint-disable no-control-regex */
import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import { Injectable } from "@nestjs/common";
import { GetSubjectPayload } from "./get-subject.payload";
import AdmZip from "adm-zip";
import {
  GDocApiServicePort,
  InjectGDocApiService,
} from "@epc-services/gdoc-api";

@Injectable()
export class GetSubjectService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort,

    @InjectGDocApiService()
    private readonly gdocApiService: GDocApiServicePort
  ) {}

  public async getSubject(payload: GetSubjectPayload): Promise<string[]> {
    const { product, productLift } = payload;
    const exactFileName = `${product} ${productLift} SL`;

    const files = await this.findRelevantFiles(exactFileName);

    if (!files.length) return [];

    const fileToUse =
      files.find((f) => f.name.trim() === exactFileName.trim()) || files[0];

    try {
      let text: string;

      if (fileToUse.mimeType === "application/vnd.google-apps.document") {
        text = await this.gdocApiService.getDocumentPlainText(fileToUse.id);
      } else {
        const fileBuffer = await this.gdriveApiService.getFileAsBuffer(
          fileToUse.id
        );

        if (!Buffer.isBuffer(fileBuffer)) {
          throw new Error("Invalid file format. Expected Buffer.");
        }

        text = this.extractTextFromDocx(fileBuffer);
      }

      text = text.replace(/&amp;/g, "&").replace(/&quot;/g, '"');

      text = this.sanitizeExtractedText(text);

      return text
        .replace(/\x0B/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
    } catch (error) {
      return [];
    }
  }

  private async findRelevantFiles(fileName: string) {
    const googleDocs = await this.gdriveApiService.searchFileWithQuery(
      `name = '${fileName}' and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
      10
    );

    const wordDocs = await this.gdriveApiService.searchFileWithQuery(
      `name = '${fileName}' and mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' and trashed = false`,
      10
    );

    let files = [...(googleDocs.files || []), ...(wordDocs.files || [])];

    if (!files.length) {
      const googleDocsPartial = await this.gdriveApiService.searchFileWithQuery(
        `name = '${fileName} ' and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
        10
      );

      const wordDocsPartial = await this.gdriveApiService.searchFileWithQuery(
        `name = '${fileName} ' and mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' and trashed = false`,
        10
      );

      files = [
        ...(googleDocsPartial.files || []),
        ...(wordDocsPartial.files || []),
      ];
    }

    if (!files.length) {
      const googleDocsPartial = await this.gdriveApiService.searchFileWithQuery(
        `name = '${fileName}.docx' and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
        10
      );

      const wordDocsPartial = await this.gdriveApiService.searchFileWithQuery(
        `name = '${fileName}.docx' and mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' and trashed = false`,
        10
      );

      files = [
        ...(googleDocsPartial.files || []),
        ...(wordDocsPartial.files || []),
      ];
    }

    return files;
  }

  private extractTextFromDocx(buffer: Buffer): string {
    try {
      const zip = new AdmZip(buffer);
      const documentXml = zip.getEntry("word/document.xml");
      if (!documentXml) throw new Error("document.xml not found in DOCX file");

      const content = documentXml.getData().toString("utf8");
      const paragraphs = content.match(/<w:p[^>]*>.*?<\/w:p>/gs) || [];

      const lines = paragraphs
        .map((p) => {
          const matches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
          return matches
            .map((m) => m.replace(/<w:t[^>]*>|<\/w:t>/g, ""))
            .join("")
            .trim();
        })
        .filter(Boolean);

      return lines.join("\n");
    } catch {
      return "Error extracting text";
    }
  }

  private sanitizeExtractedText(text: string): string {
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) =>
        String.fromCodePoint(parseInt(h, 16))
      )
      .replace(/&#([0-9]+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));

    text = text
      .replace(/<\/?w:[^>]+\/?>/gi, "")
      .replace(/<\/?m:[^>]+\/?>/gi, "")
      .replace(/<mc:AlternateContent>[\s\S]*?<\/mc:AlternateContent>/gi, "");

    text = text
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
      .replace(/\u00AD/g, "")
      .replace(/[\u200E\u200F\u061C\u202A-\u202E\u2066-\u2069]/g, "")
      .replace(/\u00A0|\u202F/g, " ");

    return text
      .replace(/\x0B/g, "\n")
      .replace(/\r\n?|\f/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}
