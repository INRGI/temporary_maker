import {
  BigQueryApiServicePort,
  InjectBigQueryApiService,
} from '@epc-services/bigquery-api';
import { Injectable } from '@nestjs/common';
import { GetCopiesWithConversionsPayload } from './get-copies-with-conversions.payload';
import { GetCopiesWithConversionsResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class GetCopiesWithConversionsService {
  constructor(
    @InjectBigQueryApiService()
    private readonly bigQueryApiService: BigQueryApiServicePort
  ) {}

  public async execute(
    payload: GetCopiesWithConversionsPayload
  ): Promise<GetCopiesWithConversionsResponseDto> {
    const { daysBefore } = payload;
    try {
      const data = await this.bigQueryApiService.getDatasetDataByQuery({
        query: `
           SELECT MAX(Date) as Date, 
           Copy, 
           SUM(Conversion) as Conversion
           FROM \`delta-daylight-316213.developers.base\`
           WHERE Date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${daysBefore} DAY) 
           AND Conversion > 0
           GROUP BY Copy
           ORDER BY Conversion DESC
       `,
      });
      return { data };
    } catch (e) {
      return { data: [] };
    }
  }
}
