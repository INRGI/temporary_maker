import { MondayConfigService } from "@epc-services/core";
import { GetProductStatusesResponseDto } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetProductStatusesService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService
  ) {}

  public async execute(): Promise<GetProductStatusesResponseDto> {
    const boardId = Number(this.mondayApiConfig.productsBoardId);
    let cursor: string | null = null;

    const uniqueProductStatuses = new Set();
    const uniqueDomainSendings = new Set();
    const uniquePartners = new Set();

    do {
      const query = `
          query ($boardId: ID!, $cursor: String) {
            boards(ids: [$boardId]) {
              items_page(limit: 500, cursor: $cursor) {
                cursor
                items {
                  id
                  name
                  group {
                    title
                  }
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

        uniqueProductStatuses.add(get("Status"));
        uniqueDomainSendings.add(get("Domain Sending"));
        uniquePartners.add(item.group?.title);
      }

      cursor = nextCursor;
    } while (cursor);

    return {
      productStatuses: Array.from(uniqueProductStatuses) as string[],
      domainSendings: Array.from(uniqueDomainSendings) as string[],
      partners: Array.from(uniquePartners) as string[],
    };
  }
}
