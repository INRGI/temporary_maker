import { Injectable } from '@nestjs/common';
import { GetCopiesWithClicksResponseDto } from '@epc-services/interface-adapters';
import { GetWarmupCopiesPayload } from './get-copies-warmup.payload';
import { GetCopiesWithClicksService } from '../get-copies-with-clicks/get-copies-with-clicks.service';

@Injectable()
export class GetCopiesWarmupService {
  constructor(
    private readonly getCopiesWithClicksService: GetCopiesWithClicksService
  ) {}

  public async execute(
    payload: GetWarmupCopiesPayload
  ): Promise<GetCopiesWithClicksResponseDto> {
    const { daysBefore } = payload;

    try {
      const { data } = await this.getCopiesWithClicksService.execute({
        daysBefore,
      });

      const grouped = new Map<string, typeof data[0]>();

      for (const entry of data) {
        if (entry.Copy.includes('_SA')) continue;
        const baseCopy = this.cleanBaseCopy(entry.Copy);
        if (!baseCopy) continue;

        const current = grouped.get(baseCopy);

        if (current) {
          current.UC += entry.UC;
          current.TC += entry.TC;
        } else {
          grouped.set(baseCopy, {
            ...entry,
            Copy: baseCopy,
          });
        }
      }

      const filtered = Array.from(grouped.values())
        .filter((entry) => entry.UC < 50)
        .sort((a, b) => a.UC - b.UC);

      return { data: filtered };
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
