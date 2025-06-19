import {
  InjectMondayApiService,
  MondayApiServicePort,
} from '@epc-services/monday-api';
import { Injectable, Logger } from '@nestjs/common';
import { GetProductDataPayload } from './get-product-data.payload';
import { GetProductDataResponse } from '@epc-services/interface-adapters';
import { MondayConfigService } from '@epc-services/core';

@Injectable()
export class GetProductDataService {
  private readonly logger: Logger = new Logger(GetProductDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
  ) {}

  public async getProductData(
    payload: GetProductDataPayload
  ): Promise<GetProductDataResponse> {
    const { product } = payload;
    const boardId = Number(this.mondayApiConfig.productsBoardId);

    const queryParams = {
      query: `
        query ($boardId: ID!, $value: CompareValue!) {
          boards(ids: [$boardId]) {
            items_page(query_params: {rules: [{column_id: "name", compare_value: $value, operator: starts_with} ]}) {
              items {
                id
                name
                column_values {
                  column {
                    title
                  }
                  text
                }
              }
            }
          }
        }
        `,
      variables: {
        boardId: boardId,
        value: `${product} -`,
      },
    };

    try {
      const mondayData = await this.mondayApiService.getItemsByQuery(
        queryParams
      );

      if (!mondayData.length) {
        return {
          productName: '',
          productStatus: '',
          broadcastCopies: '',
          domainSending: '',
        };
      }

      const productStatus = mondayData[0].column_values.find(
        (c) => c.column.title === 'Status'
      )?.text;
      const broadcastCopies = mondayData[0].column_values.find(
        (c) => c.column.title === '(B)Broadcast Copies'
      )?.text;
      const domainSending = mondayData[0].column_values.find(
        (c) => c.column.title === 'Domain Sending'
      )?.text;

      return {
        productName: product,
        productStatus,
        broadcastCopies,
        domainSending,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
