import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetRedTrackDataPayload } from "./get-monday-data.payload";
import { GetRedtracksDataService } from "../get-redtracks-data/get-redtracks-data.service";

@Injectable()
export class GetMondayDataService {
  private readonly logger: Logger = new Logger(GetMondayDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly getRedtracksDataService: GetRedtracksDataService
  ) {}

  public async getRedtrackData(
    payload: GetRedTrackDataPayload
  ): Promise<{ trackingData: string }> {
    const { product, trackingType } = payload;

    try {
      const mondayData = await this.mondayApiService.getProductDataByEndsWith(
        product,
        3858647032
      );

      if (!mondayData.length) {
        throw new Error("Product not found");
      }

      const trackingData = mondayData[0].column_values.find(
        (column) => column.column.title === trackingType
      ).text;

      if (!trackingData) return;

      return {
        trackingData,
      };
    } catch (error) {
      return;
    }
  }

  public async getAllRedtracksData(
    products: string[],
    trackingType: string
  ): Promise<
    {
      product: string;
      trackingData: string;
      imgData: string;
    }[]
  > {
    try {
      const mondayData =
        await this.getRedtracksDataService.getAllRedtracksData();

      const result = [];

      for (const productName of products) {
        const item = mondayData.find((product) =>
          product.productName.endsWith(`/${productName}`)
        );
        if (!item) continue;

        const trackingData = item.column_values.find(
          (column) => column.column.title === trackingType
        )?.text;

        result.push({ product: item.productName, trackingData });
      }
      return result;
    } catch (e) {
      this.logger.error(`Error fetching data: ${e.message}`);
      return [];
    }
  }
}
