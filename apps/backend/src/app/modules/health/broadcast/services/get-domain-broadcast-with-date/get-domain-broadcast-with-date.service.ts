import { Injectable } from '@nestjs/common';
import { GetDomainBroadcastResponseDto } from '@epc-services/interface-adapters';
import { GetDomainBroadcastFromDriveService } from '../get-domain-broadcast-from-drive/get-domain-broadcast-from-drive.service';
import { GetDomainBroadcastWithDatePayload } from './get-domain-broadcast-with-date.payload';

@Injectable()
export class GetDomainBroadcastWithDateService {
  constructor(
    private readonly getDomainBroadcastFromDriveService: GetDomainBroadcastFromDriveService
  ) {}

  public async getDomainBroadcastWithDate(
    payload: GetDomainBroadcastWithDatePayload
  ): Promise<GetDomainBroadcastResponseDto> {
    const { domain, fromDate, toDate } = payload;

    const broadcast =
      await this.getDomainBroadcastFromDriveService.getDomainBroadcastFromDrive(
        {
          domain,
        }
      );

    const filteredBroadcast = broadcast.broadcast.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDateValue = new Date(fromDate);

      if (!toDate) return itemDate >= fromDateValue;
      
      const toDateValue = new Date(toDate);
      return itemDate >= fromDateValue && itemDate <= toDateValue;
    });

    return { broadcast: filteredBroadcast };
  }
}
