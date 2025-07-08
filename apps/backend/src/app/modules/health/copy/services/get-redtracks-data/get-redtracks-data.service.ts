import {
  InjectMondayApiService,
  MondayApiColumnValue,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetRedtracksDataService {
  private readonly logger: Logger = new Logger(GetRedtracksDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async getAllRedtracksData(): Promise<
    {
      productName: string;
      column_values: MondayApiColumnValue[];
    }[]
  > {
    const cacheKey = `healthGetRedtracksData`;

    const cached = await this.cacheManager.get<
      {
        productName: string;
        column_values: MondayApiColumnValue[];
      }[]
    >(cacheKey);

    if (cached) return cached;

    try {
      const boardId = 3858647032;
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

      await this.cacheManager.set(cacheKey, mondayData, 600000);
      return mondayData;
    } catch (e) {
      this.logger.error(`Error fetching data: ${e.message}`);
      return [];
    }
  }
}
