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

  public async getRedtrackData(payload: GetRedTrackDataPayload): Promise<{
    product: string;
    trackingData: string;
    imgData: string;
    isForValidation: boolean;
  }> {
    const { product, trackingType } = payload;

    try {
      const mondayData = await this.mondayApiService.getProductData(
        product,
        803747785
      );

      if (!mondayData.length) {
        throw new Error("Product not found");
      }

      if (!trackingType) {
        return {
          product: "",
          trackingData: "",
          isForValidation:
            mondayData[0].group?.title.startsWith("*V ") ?? false,
          imgData: "",
        };
      }
      const trackingData = mondayData[0].column_values.find(
        (column) => column.column.title === trackingType
      ).text;

      if (!trackingData) {
        return {
          product: "",
          trackingData: "",
          isForValidation:
            mondayData[0].group?.title.startsWith("*V ") ?? false,
          imgData: "",
        };
      }

      const imgData = mondayData[0].column_values.find(
        (column) => column.column.title === "IMG-IT"
      ).text;
      const cleanedImgData = imgData.replace(/IMG/g, "");
      // if (!imgData) return;

      const isForValidation =
        mondayData[0].group?.title.startsWith("*V ") ?? false;

      return {
        product,
        trackingData,
        isForValidation,
        imgData: cleanedImgData,
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
      isForValidation: boolean;
    }[]
  > {
    try {
      const mondayData =
        await this.getRedtracksDataService.getAllRedtracksData();

      const result = [];

      for (const productName of products) {
        const item = mondayData.find(
          (product) =>
            product.productName.startsWith(`${productName} -`) ||
            product.productName.startsWith(`*${productName} -`)
        );
        if (!item) continue;

        const trackingData = item.column_values.find(
          (column) => column.column.title === trackingType
        )?.text;

        const imgData = item.column_values
          .find((column) => column.column.title === "IMG-IT")
          ?.text?.replace(/IMG/g, "");

        const isForValidation = item.group?.title.startsWith("*V ");

        result.push({
          product: item.productName,
          trackingData,
          imgData,
          isForValidation,
        });
      }

      return result;
    } catch (e) {
      this.logger.error(`Error fetching data: ${e.message}`);
      return [];
    }
  }
}
