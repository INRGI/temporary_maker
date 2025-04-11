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
  ): Promise<{ trackingData: string; imgData: string }> {
    const { product, trackingType } = payload;

    try{
    const mondayData = await this.mondayApiService.getProductData(
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

    const imgData = mondayData[0].column_values.find(
      (column) => column.column.title === 'IMG-IT'
    ).text;
    const cleanedImgData = imgData.replace(/IMG/g, '');
    // if (!imgData) return;

    return {
      trackingData,
      imgData: cleanedImgData,
    };
  } catch (error) {
    return;
  }
  }
}
