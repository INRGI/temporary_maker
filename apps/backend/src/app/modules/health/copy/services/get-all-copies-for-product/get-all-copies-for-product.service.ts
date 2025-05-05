/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
/* eslint-disable no-empty */
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetAllCopiesForProductPayload } from "./get-all-copies-for-product.payload";
import { GetCopyFromDriveService } from "../get-copy-from-drive/get-copy-from-drive.service";
import { GetSubjectService } from "../get-subject/get-subject.service";

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
    private readonly getCopyFromDriveService: GetCopyFromDriveService,
    private readonly getSubjectService: GetSubjectService
  ) {}

  private parseLiftsRange(
    liftsString: string,
    minLift?: number,
    maxLift?: number
  ): number[] {
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

        const effectiveStart =
          minLift !== undefined ? Math.max(start, minLift) : start;
        const effectiveEnd =
          maxLift !== undefined ? Math.min(end, maxLift) : end;

        if (!isNaN(effectiveStart) && !isNaN(effectiveEnd)) {
          for (let i = effectiveStart; i <= effectiveEnd; i++) {
            lifts.push(i);
          }
        }
      } else if (segment.includes("SA")) {
        const numPart = segment.replace(/[^\d]/g, "");
        if (numPart) {
          const liftNum = parseInt(numPart, 10);
          if (
            (minLift === undefined || liftNum >= minLift) &&
            (maxLift === undefined || liftNum <= maxLift)
          ) {
            lifts.push(liftNum);
          }
        }
      } else {
        const num = parseInt(segment.trim().replace(/[^\d]/g, ""), 10);
        if (
          !isNaN(num) &&
          (minLift === undefined || num >= minLift) &&
          (maxLift === undefined || num <= maxLift)
        ) {
          lifts.push(num);
        }
      }
    }

    return [...new Set(lifts)].sort((a, b) => a - b);
  }

  public async getAllCopies(
    payload: GetAllCopiesForProductPayload
  ): Promise<{ html: string; copyName: string; subjects?: string[] }[]> {
    const { product, minLift, maxLift } = payload;
    let mondayData;
    try {
      mondayData = await this.mondayApiService.getProductDataByEndsWith(
        product,
        3858647032
      );

      const liftsColumn = mondayData[0].column_values.find(
        (column) => column.column.title === "Broadcast copies"
      );

      if (!liftsColumn || !liftsColumn.text) {
        return [];
      }

      const liftsArray = this.parseLiftsRange(
        liftsColumn.text,
        minLift,
        maxLift
      );

      const results: { html: string; copyName: string; subjects?: string[] }[] =
        [];

      for (const liftNumber of liftsArray) {
        try {
          const copy = await this.getCopyFromDriveService.getCopyFromDrive({
            product,
            productLift: `${liftNumber}`,
            format: "html",
          });

          if (copy) {
            results.push({
              html: copy,
              copyName: `${product}${liftNumber}`,
            });

            const subjects = await this.getSubjectService.getSubject({
              product: product,
              productLift: `${liftNumber}`,
            });

            if (subjects) {
              results[results.length - 1].subjects = subjects;
            }
          }
        } catch (error) {}
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}
