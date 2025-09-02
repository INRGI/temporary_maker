import { GetMondayTrackingsResponseDto } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class GetMondayTrackingsService {
  private readonly logger: Logger = new Logger(GetMondayTrackingsService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort
  ) {}

  public async geTrackings(): Promise<GetMondayTrackingsResponseDto> {
    const mondayData = await this.mondayApiService.getProductData(
      "OGHBC",
      2013547302
    );

    if (!mondayData.length) {
      throw new Error("Redtracks not found");
    }

    const trackings: string[] = mondayData[0].column_values
      .map((column) => {
        if (
          column.column.title !== "Subitems" &&
          column.column.title !== "Status" &&
          column.column.title !== "B\\B" &&
          column.column.title !== "Sector" &&
          column.column.title !== "Bad Copies" &&
          column.column.title !== "(B)Broadcast Copies" &&
          column.column.title !== "Domain Sending" &&
          column.column.title !== "Copy Location" &&
          column.column.title !== "Expires" &&
          column.column.title !== "WarmUp" &&
          column.column.title !== "Abbreviation" &&
          column.column.title !== "Date"
        ) {
          return column.column.title;
        }
        return null;
      })
      .filter((value) => value !== null);

    return {
      trackings,
    };
  }
}
