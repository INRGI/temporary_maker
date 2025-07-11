import { Injectable } from "@nestjs/common";
import { GetMondayDataService } from "../get-monday-data/get-monday-data.service";
import { BuildLinkPayload } from "./build-link.payload";

@Injectable()
export class BuildLinkService {
  constructor(private readonly getMondayDataService: GetMondayDataService) {}

  public async buildLink(payload: BuildLinkPayload): Promise<string> {
    const { product, productLift, linkUrl, productImage } = payload;

    const trackingData: { trackingData: string } =
      await this.getMondayDataService.getRedtrackData({
        product,
        trackingType: linkUrl.trackingType,
      });

    if (!trackingData) {
      return "urlhere";
    }

    return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}${(productImage && productImage.length > 0 ? `_${productImage}` : ``)}/${product}/`;
  }

  public async buildLinkWithDataProvided(payload: BuildLinkPayload): Promise<string> {
      const { product, productLift, linkUrl, productImage, mondayProductsData } = payload;
     
     const  trackingData = mondayProductsData?.find((item) => item.product.endsWith(`/${product}`));
      
        if (!trackingData || !trackingData.trackingData) {
          return 'urlhere';
        }
      
  
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}${(productImage && productImage.length > 0 ? `_${productImage}` : ``)}/${product}/`;
    }
}
