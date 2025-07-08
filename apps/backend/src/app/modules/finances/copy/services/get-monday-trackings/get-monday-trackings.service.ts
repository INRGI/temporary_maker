import { GetMondayTrackingsResponseDto } from "@epc-services/interface-adapters";
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetMondayTrackingsService {
  private readonly logger: Logger = new Logger(GetMondayTrackingsService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async geTrackings(): Promise<GetMondayTrackingsResponseDto> {
    const cacheKey = `financeGetMondayTrackings`;

    const cached = await this.cacheManager.get<GetMondayTrackingsResponseDto>(
      cacheKey
    );

    if (cached) return cached;

    const mondayData = await this.mondayApiService.getProductData(
      "BTUA",
      803747785
    );

    if (!mondayData.length) {
      throw new Error("Redtracks not found");
    }

    const trackings: string[] = mondayData[0].column_values
      .map((column) => {
        if (
          column.column.title !== "Subitems" &&
          column.column.title !== "Status" &&
          column.column.title !== "B\\B" &&
          column.column.title !== "Sector" &&
          column.column.title !== "Bad Copies" &&
          column.column.title !== "(B)Broadcast Copies" &&
          column.column.title !== "Domain Sending" &&
          column.column.title !== "Copy Location" &&
          column.column.title !== "Expires" &&
          column.column.title !== "WarmUp" &&
          column.column.title !== "Abbreviation"
        ) {
          return column.column.title;
        }
        return null;
      })
      .filter((value) => value !== null);

    await this.cacheManager.set(
      cacheKey,
      {
        trackings,
      },
      900000
    );
    return {
      trackings,
    };
  }
}
