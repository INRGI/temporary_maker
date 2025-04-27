/* eslint-disable no-useless-catch */
import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from '@epc-services/gdrive-api';
import { Injectable } from '@nestjs/common';
import { GetDomainsByTeamPayload } from './get-domains-by-team.payload';
import { GetDomainsByTeamResponseDto } from '@epc-services/interface-adapters';
import * as XLSX from 'xlsx';

@Injectable()
export class GetDomainsByTeamService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}
  
  public async getDomains(
    payload: GetDomainsByTeamPayload
  ): Promise<GetDomainsByTeamResponseDto> {
    const { team } = payload;

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
      const domainsSet = new Set<string>();

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(sheet['!ref']);

        for (let col = 1; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: 0,
            c: col,
          });
          const cell = sheet[cellAddress];

          if (cell && cell.v) {
            const cellValue = cell.v.toString().trim();
            if (cellValue && cellValue.toLowerCase().includes('.com')) {
              domainsSet.add(cellValue);
            }
          }
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