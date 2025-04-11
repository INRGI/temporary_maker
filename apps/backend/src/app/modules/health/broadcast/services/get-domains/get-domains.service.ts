/* eslint-disable no-useless-catch */
import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import { Injectable } from "@nestjs/common";
import { GetDomainsByTeamResponseDto } from "@epc-services/interface-adapters";
import * as XLSX from "xlsx";

@Injectable()
export class GetDomainsService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}

  private getCurrentMonthSheetName(): string {
    const now = new Date();
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

    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear().toString().slice(-2);

    return `${currentMonth}'${currentYear}`;
  }

  public async getDomains(): Promise<GetDomainsByTeamResponseDto> {
    try {
      const broadcastTableId = await this.gdriveApiService.getContentLikeBuffer(
        "1GkfnmFKZYtf-B6gZJyPCdhrqy_GfBjpc5ql-qB0x02k",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      const workbook = await XLSX.read(broadcastTableId, { type: "buffer" });
      const domainsSet = new Set<string>();

      const currentMonthSheet = this.getCurrentMonthSheetName();

      if (workbook.SheetNames.includes(currentMonthSheet)) {
        const sheet = workbook.Sheets[currentMonthSheet];
        const range = XLSX.utils.decode_range(sheet["!ref"]);

        for (let col = 1; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: 0,
            c: col,
          });
          const cell = sheet[cellAddress];

          if (cell && cell.v) {
            const cellValue = cell.v.toString().trim();
            if (cellValue && cellValue.toLowerCase().includes(".com")) {
              domainsSet.add(cellValue);
            }
          }
        }
      } else {
        return { domains: [] };
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
