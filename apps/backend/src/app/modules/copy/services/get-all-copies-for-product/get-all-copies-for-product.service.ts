import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetAllCopiesForProductPayload } from "./get-all-copies-for-product.payload";
import { GetCopyFromDriveService } from "../get-copy-from-drive/get-copy-from-drive.service";

@Injectable()
export class GetAllCopiesForProductService {
  private readonly logger: Logger = new Logger(
    GetAllCopiesForProductService.name,
    {
      timestamp: true,
    }
  );

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly getCopyFromDriveService: GetCopyFromDriveService
  ) {}

  private parseLiftsRange(liftsString: string): number[] {
    if (!liftsString || liftsString.trim() === "") {
      return [];
    }

    const lifts: number[] = [];

    const segments = liftsString.split(",").map((seg) => seg.trim());

    for (const segment of segments) {
      if (segment.includes("-")) {
        const [start, end] = segment
          .split("-")
          .map((num) => parseInt(num.trim().replace(/[^\d]/g, ""), 10));

        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            lifts.push(i);
          }
        }
      } else if (segment.includes("SA")) {
        const numPart = segment.replace(/[^\d]/g, "");
        if (numPart) {
          lifts.push(parseInt(numPart, 10));
        }
      } else {
        const num = parseInt(segment.trim().replace(/[^\d]/g, ""), 10);
        if (!isNaN(num)) {
          lifts.push(num);
        }
      }
    }

    return [...new Set(lifts)].sort((a, b) => a - b);
  }

  public async getAllCopies(
    payload: GetAllCopiesForProductPayload
  ): Promise<{ html: string; copyName: string }[]> {
    const { product } = payload;

    try {
      const mondayData = await this.mondayApiService.getProductData(
        product,
        803747785
      );
      
      if (!mondayData.length) {
        throw new Error("Product not found");
      }

      const liftsColumn = mondayData[0].column_values.find(
        (column) => column.column.title === "(B)Broadcast Copies"
      );

      if (!liftsColumn || !liftsColumn.text) {
        this.logger.warn(`No lifts found for product ${product}`);
        return [];
      }

      const liftsArray = this.parseLiftsRange(liftsColumn.text);

      const results: { html: string; copyName: string }[] = [];

      for (const liftNumber of liftsArray) {
        try {
          const copy = await this.getCopyFromDriveService.getCopyFromDrive({
            product,
            productLift: `${liftNumber}`,
          });

          if (copy) {
            results.push({
              html: copy,
              copyName: `${product}${liftNumber}`,
            });
          }
        } catch (error) {
          this.logger.error(
            `Error fetching copy for ${product}${liftNumber}: ${error.message}`
          );
        }
      }

      return results;
    } catch (error) {
      this.logger.error(
        `Failed to get copies for product ${product}: ${error.message}`
      );
      throw error;
    }
  }
}
