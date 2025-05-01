import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import { Injectable, Logger } from "@nestjs/common";
import {
  BroadcastResponseDto,
  GetDomainBroadcastResponseDto,
} from "@epc-services/interface-adapters";
import { GetDomainBroadcastFromDrivePayload } from "./get-domain-broadcast-from-drive.payload";

@Injectable()
export class GetDomainBroadcastFromDriveService {
  private readonly logger = new Logger(
    GetDomainBroadcastFromDriveService.name,
    {
      timestamp: true,
    }
  );

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

    return `${monthName}'${yearShort}`;
  }

  public async getDomainBroadcastFromDrive(
    payload: GetDomainBroadcastFromDrivePayload
  ): Promise<GetDomainBroadcastResponseDto> {
    const { domain } = payload;
    const broadcastTableId = "1GkfnmFKZYtf-B6gZJyPCdhrqy_GfBjpc5ql-qB0x02k";
    const sheetName = this.getSheetNameConsideringDate();
    let rows = await this.spreadsheetService.getSheetValuesOnly(
      broadcastTableId,
      sheetName
    );

    if ((!rows || rows.length < 5) && new Date().getDate() >= 14) {
      const fallbackSheet = this.getSheetNameConsideringDate(
        new Date(new Date().setMonth(new Date().getMonth() - 1))
      );

      rows = await this.spreadsheetService.getSheetValuesOnly(
        broadcastTableId,
        fallbackSheet
      );
    }

    if (!rows || rows.length < 5) {
      throw new Error(`Sheet "${sheetName}" is empty or too short`);
    }

    const headerRow = rows[0];
    let domainColIndex = -1;

    for (let i = 0; i < headerRow.length; i++) {
      const cellValue = headerRow[i]?.trim().toLowerCase();
      if (cellValue?.endsWith(domain.toLowerCase())) {
        domainColIndex = i;
        break;
      }
    }

    if (domainColIndex === -1) {
      throw new Error(
        `Domain "${domain}" not found in header row of sheet "${sheetName}"`
      );
    }

    const broadcasts: BroadcastResponseDto[] = [];

    for (let i = 4; i < rows.length; i++) {
      const row = rows[i];
      const rawDate = row[0];
      const copyRaw = row[domainColIndex];

      if (!rawDate || !copyRaw) continue;

      let parsedDate: Date | null = null;

      if (!isNaN(Number(rawDate))) {
        parsedDate = this.formatExcelDate(Number(rawDate));
      } else {
        const tryParse = new Date(rawDate);
        if (!isNaN(tryParse.getTime())) {
          parsedDate = tryParse;
        }
      }

      if (!parsedDate) {
        continue;
      }

      const cleanedCopies = this.cleanCopyValue(copyRaw)
        .split(" ")
        .filter(
          (copy) =>
            copy.trim() &&
            copy !== "-" &&
            !copy.startsWith("1") &&
            !copy.startsWith("2") &&
            !copy.startsWith("3")
        );

      if (cleanedCopies.length > 0) {
        broadcasts.push({
          date: parsedDate,
          copies: cleanedCopies,
        });
      }
    }
    return { broadcast: broadcasts };
  }

  private formatExcelDate(excelDate: number): Date {
    const epoch = new Date(1899, 11, 30);
    const msPerDay = 24 * 60 * 60 * 1000;
    const localDate = new Date(epoch.getTime() + excelDate * msPerDay);

    localDate.setHours(0, 0, 0, 0);

    return localDate;
  }

  private cleanCopyValue(value: string): string {
    return value
      .replace(/[\n\r\t]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
