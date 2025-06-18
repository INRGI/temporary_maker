import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { Injectable } from '@nestjs/common';
import { GetCopiesWithClicksPayload } from './get-copies-with-clicks.payload';
import { GetCopiesWithClicksResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class GetCopiesWithClicksService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(
    payload: GetCopiesWithClicksPayload
  ): Promise<GetCopiesWithClicksResponseDto> {
    const { daysBefore } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
        SELECT MAX(Date) as Date, 
        Copy, 
        SUM(UC) as UC, 
        SUM(TC) as TC
        FROM \`delta-daylight-316213.developers.base\`
        WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
        AND UC > 0
        GROUP BY Copy
        ORDER BY UC DESC
    `,
      });
      return { data };
    } catch (e) {
      return { data: [] };
    }
  }
}
