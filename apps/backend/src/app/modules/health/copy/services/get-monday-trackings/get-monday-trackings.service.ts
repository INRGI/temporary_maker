
import { GetMondayTrackingsResponseDto } from '@epc-services/interface-adapters';
import {
  InjectMondayApiService,
  MondayApiServicePort,
} from '@epc-services/monday-api';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetMondayTrackingsService {
  private readonly logger: Logger = new Logger(GetMondayTrackingsService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort
  ) {}

  public async geTrackings(): Promise<GetMondayTrackingsResponseDto> {
    const mondayData = await this.mondayApiService.getProductDataByEndsWith(
      'RHITC',
      3858647032
    );

    if (!mondayData.length) {
      throw new Error('Trackings not found');
    }

    const trackings: string[] = mondayData[0].column_values
      .map((column) => {
        if (
          column.column.title !== 'Subitems' &&
          column.column.title !== 'Status' &&
          column.column.title !== 'B\\B' &&
          column.column.title !== 'Sector' &&
          column.column.title !== 'Bad Copies' &&
          column.column.title !== '(B)Broadcast Copies' &&
          column.column.title !== 'Domain Sending' &&
          column.column.title !== 'Copy Location' &&
          column.column.title !== 'Expires' &&
          column.column.title !== 'WarmUp' &&
          column.column.title !== 'Abbreviation' &&
           column.column.title !== 'Parent Company' &&
          column.column.title !== 'Offer group' &&
          column.column.title !== 'AP' &&
          column.column.title !== '📊 clck / conv' && 
          column.column.title !== 'Google Drive' &&
          column.column.title !== 'Comment' &&
          column.column.title !== 'Bad copies' &&
          column.column.title !== 'Broadcast copies' &&
          column.column.title !== 'Number of leads' &&
          column.column.title !== 'Leads from Max' &&
          column.column.title !== 'Reason' &&
          column.column.title !== 'Date' 
        ) {
          return column.column.title;
        }
        return null;
      })
      .filter((value) => value !== null);

    return {
      trackings,
    };
  }
}
