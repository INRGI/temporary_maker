import { MondayConfigService } from '@epc-services/core';
import { GetProductDataResponse } from '@epc-services/interface-adapters';
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from '@epc-services/monday-api';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllProductsDataService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
  ) {}

  public async execute(): Promise<GetProductDataResponse[]> {
    const boardId = Number(this.mondayApiConfig.productsBoardId);
    const result = [];
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
        const get = (title: string): string | null =>
          item.column_values.find((c) => c.column.title === title)?.text ??
          null;

        const status = get('Status');
        if (!status || ['Pending', 'Closed'].includes(status))
          continue;

        result.push({
          productName: item.name,
          productStatus: get('Status'),
          broadcastCopies: get('(B)Broadcast Copies'),
          domainSending: get('Domain Sending'),
        });
      }

      cursor = nextCursor;
    } while (cursor);

    return result;
  }
}
