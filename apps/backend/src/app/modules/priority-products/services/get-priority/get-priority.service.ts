import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from '@epc-services/gdrive-api';
import { Injectable } from '@nestjs/common';
import { GetPriorityPayload } from './get-priority.payload';
import * as XLSX from 'xlsx';
import { UnsubData } from '@epc-services/interface-adapters';

@Injectable()
export class GetPriorityService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}

  public async getPriorityDetails(
    payload: GetPriorityPayload
  ): Promise<UnsubData> {
    const { product, unsubLinkUrl } = payload;
    const { sheetName, unsubType, linkStart, linkEnd } = unsubLinkUrl || {};

    try {
      const fileContent = await this.gdriveApiService.getContentLikeBuffer(
        '1e40khWM1dKTje_vZi4K4fL-RA8-D6jhp2wmZSXurQH0',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      const workbook = await XLSX.read(fileContent, { type: 'buffer' });

      if (sheetName && !workbook.SheetNames.includes(sheetName)) {
        return {
          unsubscribeText: '',
          unsubscribeUrl: '',
        };
      }

      const sheetsToSearch = sheetName ? [sheetName] : workbook.SheetNames;

      for (const currentSheetName of sheetsToSearch) {
        const worksheet = workbook.Sheets[currentSheetName];
        const aoa = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        if (aoa.length === 0) continue;

        let headerRowIdx = -1;
        let productColIdx = -1;

        for (let rowIdx = 0; rowIdx < aoa.length; rowIdx++) {
          const row = aoa[rowIdx] as any[];

          if (!Array.isArray(row)) continue;

          for (let colIdx = 0; colIdx < row.length; colIdx++) {
            const cell = row[colIdx];
            if (
              cell &&
              typeof cell === 'string' &&
              cell.toString() === 'PRODUCT'
            ) {
              headerRowIdx = rowIdx;
              productColIdx = colIdx;
              break;
            }
          }

          if (headerRowIdx !== -1) break;
        }

        if (headerRowIdx === -1 || productColIdx === -1) {
          continue;
        }

        let unsubTextColIdx = -1;
        const headerRow = aoa[headerRowIdx] as any[];

        for (let colIdx = 0; colIdx < headerRow.length; colIdx++) {
          const cell = headerRow[colIdx];
          if (
            cell &&
            typeof cell === 'string' &&
            cell.toString() === 'UNSUB TEXT'
          ) {
            unsubTextColIdx = colIdx;
            break;
          }
        }

        let customUnsubColIdx = -1;
        if (unsubType) {
          for (let colIdx = 0; colIdx < headerRow.length; colIdx++) {
            const cell = headerRow[colIdx];
            if (
              cell &&
              typeof cell === 'string' &&
              cell.toString().trim().toLowerCase() === unsubType.trim().toLowerCase()
            ) {
              customUnsubColIdx = colIdx;
              break;
            }
          }
        }

        let unsubUrlColIdx = -1;
        for (let colIdx = 0; colIdx < headerRow.length; colIdx++) {
          const cell = headerRow[colIdx];

          if (
            cell &&
            typeof cell === 'string' &&
            cell.toString().trim().toLowerCase() === 'unsub url'
          ) {
            unsubUrlColIdx = colIdx;
            break;
          }
        }

        for (let rowIdx = headerRowIdx + 1; rowIdx < aoa.length; rowIdx++) {
          const row = aoa[rowIdx] as any[];

          if (!Array.isArray(row) || row.length <= productColIdx) continue;

          const cellProduct = row[productColIdx];

          const products = cellProduct.split(/[\s\/\\]+/);
          if (products.includes(product)) {
            let unsubscribeText = null;
            let unsubscribeUrl = null;

            if (unsubTextColIdx !== -1 && row.length > unsubTextColIdx) {
              unsubscribeText = row[unsubTextColIdx];
            }

            let unsubTypeValue = null;

            if (
              customUnsubColIdx !== -1 &&
              row.length > customUnsubColIdx &&
              row[customUnsubColIdx]
            ) {
              unsubTypeValue = row[customUnsubColIdx];
            } else if (unsubUrlColIdx !== -1 && row.length >= unsubUrlColIdx) {
              unsubTypeValue = row[unsubUrlColIdx];
            }

            if (unsubTypeValue) {
              if (
                linkStart !== undefined &&
                linkEnd !== undefined &&
                !unsubTypeValue.includes('http')
              ) {
                unsubscribeUrl = `${linkStart}${unsubTypeValue}${linkEnd}`;
              } else {
                unsubscribeUrl = unsubTypeValue;
              }
            }

            return {
              unsubscribeText: unsubscribeText
                ? this.processUnsubText(unsubscribeText)
                : '',
              unsubscribeUrl: unsubscribeUrl || '',
            };
          }
        }
      }

      return {
        unsubscribeText: '',
        unsubscribeUrl: '',
      };
    } catch (error) {
      return {
        unsubscribeText: '',
        unsubscribeUrl: '',
      };
    }
  }

  private processUnsubText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/\s+/g, ' ').trim();
  }
}
