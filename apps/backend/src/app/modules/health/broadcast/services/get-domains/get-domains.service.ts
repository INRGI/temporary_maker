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

  private getSheetNameConsideringDate(date = new Date()): string {
    const now = date;
    const day = now.getDate();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let monthIndex = now.getMonth();
    let year = now.getFullYear();

    if (day < 14 || (isWeekend && day <= 16)) {
      monthIndex -= 1;
      if (monthIndex < 0) {
        monthIndex = 11;
        year -= 1;
      }
    }

    const monthName = months[monthIndex];
    const yearShort = year.toString().slice(-2);

    return `${monthName}'${yearShort}!1:1`;
  }

  public async getDomains(): Promise<GetDomainsByTeamResponseDto> {
    try {
      const broadcastTableId = "1GkfnmFKZYtf-B6gZJyPCdhrqy_GfBjpc5ql-qB0x02k";
      const sheetName = this.getSheetNameConsideringDate();

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
