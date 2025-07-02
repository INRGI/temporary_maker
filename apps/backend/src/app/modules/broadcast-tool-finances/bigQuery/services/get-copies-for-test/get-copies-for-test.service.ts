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

      const grouped = new Map<string, typeof data[0]>();

      for (const entry of data) {
        if (!entry.Copy || entry.Copy.includes('_SA')) continue;
        const baseCopy = this.cleanBaseCopy(entry.Copy);
        if (!baseCopy) continue;

        const current = grouped.get(baseCopy);

        if (current) {
          current.Sends += entry.Sends;
        } else {
          grouped.set(baseCopy, {
            ...entry,
            Copy: baseCopy,
          });
        }
      }

      return { data: Array.from(grouped.values()) } as GetCopiesWithSendsResponseDto;
    } catch (e) {
      return { data: [] };
    }
  }

  private cleanBaseCopy(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : '';
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : '';
    return `${product}${productLift}`;
  }
}
