import { MondayConfigService } from "@epc-services/core";
import { GetProductDataResponse } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetAllProductsDataService {
  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async execute(): Promise<GetProductDataResponse[]> {
    const boardId = Number(this.mondayApiConfig.productsBoardId);
    const result: GetProductDataResponse[] = [];
    let cursor: string | null = null;

    const cacheKey = `allProductsData:${boardId}`;

    const cached = await this.cacheManager.get<GetProductDataResponse[]>(
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

        const status = get("Status");
        if (!status || ["Pending", "Closed"].includes(status)) continue;

        if (item.group?.title === "ARCHIVE") {
          continue;
        }

        result.push({
          productName: item.name,
          productStatus: get("Status"),
          broadcastCopies: get("(B)Broadcast Copies"),
          domainSending: get("Domain Sending"),
          sector: get("Sector"),
          partner: item.group?.title ?? null,
        });
      }

      cursor = nextCursor;
    } while (cursor);

    await this.cacheManager.set(cacheKey, result, 900000);
    return result;
  }
}
