/* eslint-disable no-useless-catch */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import { Injectable } from "@nestjs/common";
import { GetDomainsByTeamResponseDto } from "@epc-services/interface-adapters";

@Injectable()
export class GetDomainsService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  private getCurrentMonthSheetName(): string {
    const now = new Date();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear().toString().slice(-2);
    return `${currentMonth}'${currentYear}`;
  }

  public async getDomains(): Promise<GetDomainsByTeamResponseDto> {
    try {
      const broadcastTableId = "1GkfnmFKZYtf-B6gZJyPCdhrqy_GfBjpc5ql-qB0x02k";
      const sheetName = "Marchʼ25!1:1";

      const rows = await this.spreadsheetService.getSheetValuesOnly(
        broadcastTableId,
        sheetName
      );

      if (!rows || rows.length === 0) {
        return { domains: [] };
      }

      const headerRow = rows[0];
      const domainsSet = new Set<string>();

      for (const rawValue of headerRow) {
        if (!rawValue) continue;

        const cleaned = rawValue.replace(/[\n\r\t]/g, "").trim();
        if (cleaned.toLowerCase().includes(".com")) {
          domainsSet.add(cleaned);
        }
      }

      const domains = Array.from(domainsSet).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );

      return { domains };
    } catch (error) {
      throw error;
    }
  }
}
