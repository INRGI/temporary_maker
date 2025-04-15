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
        const from = new Date(fromDate);
        const to = toDate ? new Date(toDate) : null;
      
        const itemDay = itemDate.getDate();
        const itemMonth = itemDate.getMonth();
      
        const fromDay = from.getDate();
        const fromMonth = from.getMonth();
      
        const isAfterFrom =
          itemMonth > fromMonth ||
          (itemMonth === fromMonth && itemDay >= fromDay);
      
        if (!to) return isAfterFrom;
      
        const toDay = to.getDate();
        const toMonth = to.getMonth();
      
        const isBeforeTo =
          itemMonth < toMonth ||
          (itemMonth === toMonth && itemDay <= toDay);
      
        return isAfterFrom && isBeforeTo;
      });
      

    return { broadcast: filteredBroadcast };
  }
}
