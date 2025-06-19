import { MondayConfigService } from '@epc-services/core';
import { GetDomainStatusesResponseDto } from '@epc-services/interface-adapters';
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from '@epc-services/monday-api';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetDomainStatusesService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
  ) {}

  public async execute(): Promise<GetDomainStatusesResponseDto> {
    const boardId = Number(this.mondayApiConfig.domainsBoardId);
    let cursor: string | null = null;

    const uniqueDomainStatuses = new Set();
    const uniqueParentCompanies = new Set();
    const uniqueEsps = new Set();

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

        uniqueDomainStatuses.add(get('Status'));
        uniqueParentCompanies.add(get('Parent Company'));
        uniqueEsps.add(get('ESP'));
      }

      cursor = nextCursor;
    } while (cursor);

    return {
      uniqueDomainStatuses: Array.from(uniqueDomainStatuses) as string[],
      uniqueParentCompanies: Array.from(uniqueParentCompanies) as string[],
      uniqueEsps: Array.from(uniqueEsps) as string[],
    };
  }
}
