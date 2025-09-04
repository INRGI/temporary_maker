import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetCopyFromDrivePayload } from "./get-copy-from-drive.payload";

@Injectable()
export class GetCopyFromDriveService {
  private readonly logger: Logger = new Logger(GetCopyFromDriveService.name, {
    timestamp: true,
  });

  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}
  public async getCopyFromDrive(
    payload: GetCopyFromDrivePayload
  ): Promise<string> {
    const { product, productLift, format } = payload;
    const driveId = "0AKbon7yApGBvUk9PVA";
    let html;
    try {
      let files = await this.gdriveApiService.searchFileWithQuery(
        `name = '${product}${productLift}_${format || 'html'}.html' and mimeType = 'text/html' and trashed = false`,
        10,
        undefined,
        driveId
      );

      if (!files.files.length) {
        files = await this.gdriveApiService.searchFileWithQuery(
          `name = '${product}${productLift}_${format || 'html'}(Approve needed).html' and mimeType = 'text/html' and trashed = false`,
          10,
          undefined,
          driveId
        );

        if (!files.files.length) {
          throw new Error("Files not found");
        }
      }

      const fileId = files.files[0].id;
      html = await this.gdriveApiService.getFile(fileId, "media");

      return html
        .toString()
        .replace(/\n/g, "")
        .replace(/\n/g, "")
        .replace(/\s+/g, " ");
    } catch (error) {
      return `Error reading file: ${error.message}`;
    }
  }
}
