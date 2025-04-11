/* eslint-disable no-useless-catch */
import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import { Injectable, Logger } from "@nestjs/common";
import * as XLSX from "xlsx";
import {
  BroadcastResponseDto,
  GetDomainBroadcastResponseDto,
} from "@epc-services/interface-adapters";
import { GetDomainBroadcastFromDrivePayload } from "./get-domain-broadcast-from-drive.payload";

@Injectable()
export class GetDomainBroadcastFromDriveService {
  private readonly logger: Logger = new Logger(
    GetDomainBroadcastFromDriveService.name,
    {
      timestamp: true,
    }
  );

  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}

  private getCurrentMonthSheetName(): string {
    const now = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear().toString().slice(-2);
    
    return `${currentMonth}'${currentYear}`;
  }

  public async getDomainBroadcastFromDrive(
    payload: GetDomainBroadcastFromDrivePayload
  ): Promise<GetDomainBroadcastResponseDto> {
    const { domain } = payload;

    try {
      const broadcastTableId = await this.gdriveApiService.getContentLikeBuffer(
        "1GkfnmFKZYtf-B6gZJyPCdhrqy_GfBjpc5ql-qB0x02k",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      const workbook = await XLSX.read(broadcastTableId, { type: "buffer" });
      const broadcastData: BroadcastResponseDto[] = [];
      let domainFound = false;

      const currentMonthSheet = this.getCurrentMonthSheetName();
      
      if (!workbook.SheetNames.includes(currentMonthSheet)) {
        throw new Error(`Sheet for current month "${currentMonthSheet}" not found.`);
      }
      
      const sheet = workbook.Sheets[currentMonthSheet];
      const range = XLSX.utils.decode_range(sheet["!ref"]);

      let domainColumnIndex = -1;
      const availableColumns: string[] = [];

      for (let headerRow = 0; headerRow < 99; headerRow++) {
        for (let col = 0; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: headerRow,
            c: col,
          });
          const cell = sheet[cellAddress];

          if (cell && cell.v) {
            const cellValue = cell.v.toString().trim();
            availableColumns.push(cellValue);

            if (cellValue.toLowerCase().includes(domain.toLowerCase())) {
              domainColumnIndex = col;
              const dataStartRow = headerRow + 4;

              for (let row = dataStartRow; row <= range.e.r; row++) {
                const valueCell =
                  sheet[
                    XLSX.utils.encode_cell({ r: row, c: domainColumnIndex })
                  ];
                const dateCell =
                  sheet[XLSX.utils.encode_cell({ r: row, c: 0 })];

                if (valueCell && valueCell.v && dateCell && dateCell.v) {
                  const cleanedValue = this.cleanCopyValue(
                    valueCell.v.toString()
                  );
                  const copiesArray = cleanedValue
                    .split(" ")
                    .filter((copy) => copy.trim() !== "" && copy !== "-");

                  if (copiesArray.length > 0) {
                    const broadcast: BroadcastResponseDto = {
                      date: this.formatExcelDate(dateCell.v),
                      copies: copiesArray,
                    };
                    broadcastData.push(broadcast);
                  }
                }
              }

              domainFound = true;
              break;
            }
          }
        }
        if (domainFound) break;
      }

      if (!domainFound) {
        throw new Error(
          `Domain "${domain}" not found in the current month sheet "${currentMonthSheet}". Available columns logged.`
        );
      }

      return { broadcast: broadcastData };
    } catch (error) {
      throw error;
    }
  }

  private formatExcelDate(excelDate: string): Date {
    const date = XLSX.SSF.parse_date_code(Number(excelDate));
    const normalDate = new Date(date.y, date.m - 1, date.d, 0, 0, 0, 0);
    return normalDate;
  }

  private cleanCopyValue(value: string): string {
    return value
      .replace(/[\n\r\t]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}