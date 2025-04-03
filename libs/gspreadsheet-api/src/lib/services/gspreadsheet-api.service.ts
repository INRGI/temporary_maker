import { google, sheets_v4 } from 'googleapis';
import { Inject, Injectable } from '@nestjs/common';
import { GSpreadsheetApiTokens } from '../gspreadsheet-api.tokens';
import { GSpreadsheetApiConnectionOptions } from '../interfaces';
import { GSpreadsheetApiServicePort } from './gspreadsheet-api.service.port';

@Injectable()
export class GSpreadsheetApiService implements GSpreadsheetApiServicePort {
  constructor(
    @Inject(GSpreadsheetApiTokens.GSpreadsheetApiModuleOptions)
    private readonly options: GSpreadsheetApiConnectionOptions
  ) {}

  public async getSheetWithRichText(
    spreadsheetId: string,
    sheetName?: string
  ): Promise<sheets_v4.Schema$Sheet | undefined> {
    const sheetsApi = await this.createClient();

    const encodedSheetName = sheetName?.includes(' ')
      ? `'${sheetName}'`
      : sheetName;

    const response = await sheetsApi.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges: encodedSheetName ? [encodedSheetName] : undefined,
      fields:
        'sheets.data.rowData.values(formattedValue,textFormatRuns,userEnteredValue)',
    });

    return response.data.sheets?.[0];
  }

  private async createClient(): Promise<sheets_v4.Sheets> {
    const jwtAuth = new google.auth.JWT(
      this.options.client_email,
      undefined,
      this.options.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    return google.sheets({ version: 'v4', auth: jwtAuth });
  }
} 
