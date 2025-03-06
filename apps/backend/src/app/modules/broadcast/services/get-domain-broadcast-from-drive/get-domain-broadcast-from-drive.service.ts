import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from '@epc-services/gdrive-api';
import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  BroadcastResponseDto,
  GetDomainBroadcastResponseDto,
} from '@epc-services/interface-adapters';
import { GetDomainBroadcastFromDrivePayload } from './get-domain-broadcast-from-drive.payload';

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

  public async getDomainBroadcastFromDrive(
    payload: GetDomainBroadcastFromDrivePayload
  ): Promise<GetDomainBroadcastResponseDto> {
    const { team, domain } = payload;

    try {
      const broadcastTableSearchResult =
        await this.gdriveApiService.searchFileWithQuery(
          `name contains 'Broadcast ${team}' and mimeType = 'application/vnd.google-apps.spreadsheet'`,
          10
        );

      if (!broadcastTableSearchResult.files.length) {
        throw new Error(`Broadcast table not found for team ${team}`);
      }

      const broadcastTableId = await this.gdriveApiService.getContentLikeBuffer(
        broadcastTableSearchResult.files[0].id, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      const workbook = await XLSX.read(broadcastTableId, { type: 'buffer' });
      const broadcastData: BroadcastResponseDto[] = [];
      let domainFound = false;

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(sheet['!ref']);

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
                      .split(' ')
                      .filter((copy) => copy.trim() !== '' && copy !== '-');

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

        this.logger.debug(
          `Sheet: ${sheetName} | Available columns: ${availableColumns.join(
            ', '
          )}`
        );
        if (domainFound) break;
      }

      if (!domainFound) {
        throw new Error(
          `Domain "${domain}" not found in any sheet. Available columns logged.`
        );
      }

      return { broadcast: broadcastData };
    } catch (error) {
      this.logger.error(
        `Error processing broadcast data: ${error.message}`,
        error.stack
      );
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
      .replace(/[\n\r\t]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
