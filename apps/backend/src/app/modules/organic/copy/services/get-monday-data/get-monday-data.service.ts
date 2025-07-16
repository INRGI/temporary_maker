import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetRedTrackDataPayload } from "./get-monday-data.payload";

@Injectable()
export class GetMondayDataService {
  private readonly logger: Logger = new Logger(GetMondayDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort
  ) {}

  public async getRedtrackData(
    payload: GetRedTrackDataPayload
  ): Promise<{ trackingData: string; imgData: string }> {
    const { product, trackingType } = payload;

    try {
      const mondayData = await this.mondayApiService.getProductData(
        product,
        2013547302
      );

      if (!mondayData.length) {
        throw new Error("Product not found");
      }

      const trackingData = mondayData[0].column_values.find(
        (column) => column.column.title === trackingType
      ).text;

      if (!trackingData) return;

      const imgData = mondayData[0].column_values.find(
        (column) => column.column.title === "Product ID"
      ).text;

      return {
        trackingData,
        imgData,
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
      const boardId = 2013547302;
    const mondayData = [];
    let cursor: string | null = null;

    do {
      const query = `
          query ($boardId: ID!, $cursor: String) {
            boards(ids: [$boardId]) {
              items_page(limit: 500, cursor: $cursor) {
                cursor
                items {
                  id
                  name
                  column_values {
                    column { title }
                    text
                  }
                }
              }
            }
          }
        `;

      const variables = { boardId, cursor };

      const { items, cursor: nextCursor } =
        await this.mondayApiService.getItemsWithCursor({ query, variables });

      for (const item of items) {
        mondayData.push({
          productName: item.name,
          column_values: item.column_values,
        });
      }

      cursor = nextCursor;
    } while (cursor);
    
    const result = [];

      for (const productName of products) {
        const item = mondayData.find((product) => product.productName.startsWith(`${productName} -`) || product.productName.startsWith(`*${productName} -`));
        if (!item) continue;
        
        const trackingData = item.column_values.find(
          (column) => column.column.title === trackingType
        )?.text;

        const imgData = item.column_values
          .find((column) => column.column.title === "Product ID")
          ?.text

        result.push({ product: item.productName, trackingData, imgData });
      }
      return result;
    } catch (e) {
      this.logger.error(`Error fetching data: ${e.message}`);
      return [];
    }
  }
}
