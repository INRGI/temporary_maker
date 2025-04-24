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
    const { team, domain, fromDate, toDate } = payload;

    const broadcast =
      await this.getDomainBroadcastFromDriveService.getDomainBroadcastFromDrive(
        {
          team,
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
// import { Injectable } from '@nestjs/common';
// import { GetDomainBroadcastResponseDto } from '@epc-services/interface-adapters';
// import { GetDomainBroadcastFromDriveService } from '../get-domain-broadcast-from-drive/get-domain-broadcast-from-drive.service';
// import { GetDomainBroadcastWithDatePayload } from './get-domain-broadcast-with-date.payload';

// @Injectable()
// export class GetDomainBroadcastWithDateService {
//   constructor(
//     private readonly getDomainBroadcastFromDriveService: GetDomainBroadcastFromDriveService
//   ) {}

//   public async getDomainBroadcastWithDate(
//     payload: GetDomainBroadcastWithDatePayload
//   ): Promise<GetDomainBroadcastResponseDto> {
//     const { team, domain, fromDate, toDate } = payload;

//     const broadcast =
//       await this.getDomainBroadcastFromDriveService.getDomainBroadcastFromDrive({
//         team,
//         domain,
//       });

//       const normalize = (input: string | Date): string => {
//         const date = typeof input === 'string' ? new Date(input) : input;
      
//         const m = date.getUTCMonth();
//         const d = date.getUTCDate();
      
//         const mm = String(m + 1).padStart(2, '0');
//         const dd = String(d).padStart(2, '0');
      
//         return `${mm}-${dd}`;
//       };
      

//     const fromKey = normalize(fromDate);
//     const toKey = toDate ? normalize(toDate) : null;

//     const filteredBroadcast = broadcast.broadcast.filter((item) => {
//       const itemKey = normalize(item.date);

//       return itemKey >= fromKey && itemKey <= toKey;
//     });
    

//     return { broadcast: filteredBroadcast };
//   }
// }
