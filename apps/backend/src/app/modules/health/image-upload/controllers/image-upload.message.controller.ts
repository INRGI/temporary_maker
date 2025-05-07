import { Controller, Post, Body, UploadedFile, Req } from "@nestjs/common";
import { UploadImageToWordpressService } from "../services/upload-image-to-wordpress/upload-image-to-wordpress.service";
import { FastifyRequest } from "fastify";

@Controller("health/image-upload")
export class ImageUploadMessageController {
  constructor(
    private readonly uploadImageToWordpressService: UploadImageToWordpressService
  ) {}

  @Post("url")
  async uploadImageFromUrl(
    @Body()
    body: {
      imageUrl: string;
      wordpressUrl: string;
      username: string;
      appPassword: string;
    }
  ): Promise<string> {
    const { imageUrl, wordpressUrl, username, appPassword } = body;
    return this.uploadImageToWordpressService.uploadImageFromUrl(
      imageUrl,
      wordpressUrl,
      username,
      appPassword
    );
  }

  @Post("file")
  async uploadImageFromFile(@Req() req: FastifyRequest): Promise<string> {
    const file = await req.file();
    
    const { wordpressUrl, username, appPassword } = JSON.parse((file.fields.body as any).value);
    return this.uploadImageToWordpressService.uploadImageFromFile(
      file,
      wordpressUrl,
      username,
      appPassword
    );
  }
}
