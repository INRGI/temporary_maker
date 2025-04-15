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

    return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}_${productImage}`;
  }
}
