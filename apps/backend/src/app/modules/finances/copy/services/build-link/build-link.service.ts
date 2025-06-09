import { Injectable } from '@nestjs/common';
import { GetMondayDataService } from '../get-monday-data/get-monday-data.service';
import { BuildLinkPayload } from './build-link.payload';


@Injectable()
export class BuildLinkService {
  constructor(private readonly getMondayDataService: GetMondayDataService) {}

  public async buildLink(payload: BuildLinkPayload): Promise<string> {
    const { product, productLift, linkUrl, productImage } = payload;
    let trackingData: { trackingData: string; imgData: string };

    trackingData = await this.getMondayDataService.getRedtrackData({
      product,
      trackingType: linkUrl.trackingType,
    });

    if (!trackingData) {
      trackingData = await this.getMondayDataService.getRedtrackData({
        product: `*${product}`,
        trackingType: linkUrl.trackingType,
      })
    
      if (!trackingData) {
        return 'urlhere';
      }
    }

    if (linkUrl.productCode === 'PRODUCT#IMAGE') {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}${productImage}`;
    }

    if (linkUrl.productCode === 'IMG0000_#IMAGE') {
      if(!trackingData.imgData) return 'urlhere';
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}IMG${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === '0000_#IMAGE') {
      if(!trackingData.imgData) return 'urlhere';
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === '000_#IMAGE') {
      if(!trackingData.imgData) return 'urlhere';
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.imgData.slice(1)}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === 'TRACKINGID_#IMAGE') {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.trackingData}_${productLift}${productImage}`;
    }

    return 'urlhere';
  }

  public async buildLinkWithDataProvided(payload: BuildLinkPayload): Promise<string> {
    const { product, productLift, linkUrl, productImage, mondayProductsData } = payload;
    let trackingData: { trackingData: string; imgData: string };
    
    trackingData = mondayProductsData?.find((item) => item.product.startsWith(`${product} -`));

    if (!trackingData) {
      trackingData = mondayProductsData?.find((item) => item.product.startsWith(`*${product} -`));
      if (!trackingData) {
        return 'urlhere';
      }
    }

    if (linkUrl.productCode === 'PRODUCT#IMAGE') {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}${productImage}`;
    }

    if (linkUrl.productCode === 'IMG0000_#IMAGE') {
      if(!trackingData.imgData) return 'urlhere';
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}IMG${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === '0000_#IMAGE') {
      if(!trackingData.imgData) return 'urlhere';
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === '000_#IMAGE') {
      if(!trackingData.imgData) return 'urlhere';
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.imgData.slice(1)}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === 'TRACKINGID_#IMAGE') {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.trackingData}_${productLift}${productImage}`;
    }

    return 'urlhere';
  }
}
