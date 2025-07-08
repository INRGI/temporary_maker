import { MondayConfigService } from "@epc-services/core";
import { GetDomainDataResponse } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetAllDomainsDataService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<GetDomainDataResponse[]> {
    const boardId = Number(this.mondayApiConfig.domainsBoardId);
    const result: GetDomainDataResponse[] = [];
    let cursor: string | null = null;

    const cacheKey = `allDomainsData:${boardId}`;

    const cached = await this.cacheManager.get<GetDomainDataResponse[]>(
      cacheKey
    );

    if (cached) return cached;

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

        const status = get("Status");
        if (!status || !["Live", "Killing", "Warm Up", "Hold"].includes(status))
          continue;

        result.push({
          domainName: item.name,
          domainStatus: status,
          parentCompany: get("Parent Company"),
          domainEsp: get("ESP"),
        });
      }

      cursor = nextCursor;
    } while (cursor);

    await this.cacheManager.set(cacheKey, result, 900000);
    return result;
  }
}
