import {
  InjectMondayApiService,
  MondayApiServicePort,
} from '@epc-services/monday-api';
import { Injectable, Logger } from '@nestjs/common';
import { GetRedTrackDataPayload } from './get-monday-data.payload';

@Injectable()
export class GetMondayDataService {
  private readonly logger: Logger = new Logger(GetMondayDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort
  ) {}

  public async getRedtrackData(
    payload: GetRedTrackDataPayload
  ): Promise<{ trackingData: string }> {
    const { product, trackingType } = payload;

    try{
    const mondayData = await this.mondayApiService.getProductDataByEndsWith(
      product,
      803747785
    );

    if (!mondayData.length) {
      throw new Error('Product not found');
    }

    const trackingData = mondayData[0].column_values.find(
      (column) => column.column.title === trackingType
    ).text;

    if (!trackingData) return;

    return {
      trackingData,
    };
  } catch (error) {
    return;
  }
  }
}
