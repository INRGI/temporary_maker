import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";

@Injectable()
export class UploadImageToExactTargetService {
  private readonly logger = new Logger(UploadImageToExactTargetService.name);

  async uploadImageFromBuffer(
    file: any,
    filename: string,
    accessToken: string,
    etSubdomain: string
  ): Promise<string> {
    const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      return Buffer.concat(chunks);
    };

    const fileBuffer = await streamToBuffer(file.file);

    const form = new FormData();
    form.append("file", fileBuffer, filename);
    form.append("name", filename);
    form.append("assetType", JSON.stringify({ name: "image", id: 28 }));
    form.append("FileProperties", JSON.stringify({ fileName: filename }));

    try {
      const response = await axios.post(
        `https://${etSubdomain}.rest.marketingcloudapis.com/asset/v1/content/assets`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...form.getHeaders(),
          },
        }
      );

      return response.data?.fileProperties?.publishedURL || "";
    } catch (error) {
      this.logger.error(
        `Failed to upload image: ${error.message}`,
        error.stack
      );
      return "";
    }
  }
}
