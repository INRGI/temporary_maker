import { sheets_v4 } from 'googleapis';

export interface GSpreadsheetApiServicePort {
  getSheetWithRichText(
    spreadsheetId: string,
    sheetName?: string
  ): Promise<sheets_v4.Schema$Sheet | undefined>;
}
