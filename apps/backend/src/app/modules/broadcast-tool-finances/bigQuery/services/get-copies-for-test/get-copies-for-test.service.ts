import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { Injectable } from '@nestjs/common';
import { GetCopiesForTestPayload } from './get-copies-for-test.payload';
import { GetCopiesWithSendsResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class GetCopiesForTestService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(payload: GetCopiesForTestPayload): Promise<GetCopiesWithSendsResponseDto> {
    const { daysBefore } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
        SELECT MAX(Date) as Date, 
        Copy, 
        SUM(Sends) as Sends,
        FROM \`delta-daylight-316213.developers.sends\`
        WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
        GROUP BY Copy
        ORDER BY Sends DESC
    `,
      });

      return { data } as GetCopiesWithSendsResponseDto;
    } catch (e) {
      console.log(e);
      return { data: [] };
    }
  }
}
