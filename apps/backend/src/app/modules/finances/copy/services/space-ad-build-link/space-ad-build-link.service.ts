import { Injectable } from "@nestjs/common";
import { SpaceAdBuildLinkPayload } from "./space-ad-build-link.payload";
import { BuildLinkService } from "../build-link/build-link.service";
import { GetMondayDataService } from "../get-monday-data/get-monday-data.service";

@Injectable()
export class SpaceAdBuildLinkService {
  constructor(
    private readonly buildLinkService: BuildLinkService,
    private readonly getMondayDataService: GetMondayDataService
  ) {}

  public async buildLink(payload: SpaceAdBuildLinkPayload): Promise<string> {
    const { copyName, linkUrl } = payload;

    const product = copyName.match(/^[a-zA-Z]+/)[0];
    const productLift = copyName.match(/[a-zA-Z]+(\d+)/)
      ? copyName.match(/[a-zA-Z]+(\d+)/)[1]
      : "";
    const productImage = copyName.match(/\d+([a-zA-Z].*)/)
      ? copyName.match(/\d+([a-zA-Z].*)/)[1]
      : "";

    let trackingData: {
      product: string;
      trackingData: string;
      imgData: string;
      isForValidation: boolean;
    };

    trackingData = await this.getMondayDataService.getRedtrackData({
      product,
      trackingType: linkUrl && linkUrl.trackingType ? linkUrl.trackingType : "",
    });

    if (!trackingData) {
      trackingData = await this.getMondayDataService.getRedtrackData({
        product: `*${product}`,
        trackingType:
          linkUrl && linkUrl.trackingType ? linkUrl.trackingType : "",
      });

      if (!trackingData || !trackingData.trackingData) {
        return "urlhere";
      }
    }

    const link = await this.buildLinkService.buildLink({
      product,
      productLift,
      productImage,
      trackingData,
      linkUrl: linkUrl,
    });

    return link;
  }
}
