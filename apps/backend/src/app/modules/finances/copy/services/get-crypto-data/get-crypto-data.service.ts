import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import { CryptoPartnerMapping } from "@epc-services/interface-adapters";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class GetCryptoDataService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  private readonly SPREADSHEET_ID = "1i2zNJF74FjCCgGsVlKJiZtqt59r1kpmQ8g2OSwwP7Sw";
  private readonly CACHE_KEY = `cryptoPartnerMappings:${this.SPREADSHEET_ID}`;
  private readonly REQUIRED_HEADERS = {
    partnerId: "id number of partner",
    ourId: "our id number",
  };

  public async execute(): Promise<
    {
      product: string;
      mappings: CryptoPartnerMapping[];
    }[]
  > {
    const cached = await this.cacheManager.get<
      {
        product: string;
        mappings: CryptoPartnerMapping[];
      }[]
    >(this.CACHE_KEY);
    if (cached) return cached;

    const result: { product: string; mappings: CryptoPartnerMapping[] }[] = [];

    try {
      const spreadsheet = await this.spreadsheetService.getSpreadsheetWithData(
        this.SPREADSHEET_ID
      );
      const sheets = spreadsheet?.sheets || [];

      for (const sheet of sheets) {
        const sheetName = sheet.properties?.title;
        if (!sheetName) continue;

        const rows = sheet.data?.[0]?.rowData;
        if (!rows?.length) continue;

        const headers =
          rows[0].values?.map(
            (c) => c.formattedValue?.toLowerCase().trim() || ""
          ) || [];

        const partnerIdx = headers.findIndex((h) =>
          h.toLocaleLowerCase() === this.REQUIRED_HEADERS.partnerId
        );
        const ourIdIdx = headers.findIndex((h) =>
          h.toLocaleLowerCase() === this.REQUIRED_HEADERS.ourId
        );

        if (partnerIdx === -1 || ourIdIdx === -1) continue;

        const mappings: CryptoPartnerMapping[] = [];

        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].values || [];

          const partnerId = cells[partnerIdx]?.formattedValue?.trim();
          const ourId = cells[ourIdIdx]?.formattedValue?.trim();

          if (partnerId && ourId) {
            mappings.push({ partnerId, ourId });
          }
        }

        if (mappings.length > 0) {
          result.push({
            product: sheetName,
            mappings,
          });
        }
      }

      await this.cacheManager.set(this.CACHE_KEY, result, 900000);

      return result;
    } catch (error) {
      return [];
    }
  }
}
