import { Injectable } from "@nestjs/common";
import { SpaceAdBuildLinkPayload } from "./space-ad-build-link.payload";
import { BuildLinkService } from "../build-link/build-link.service";

@Injectable()
export class SpaceAdBuildLinkService {
  constructor(private readonly buildLinkService: BuildLinkService) {}

  public async buildLink(payload: SpaceAdBuildLinkPayload): Promise<string> {
    const { copyName, linkUrl } = payload;

    const product = copyName.match(/^[a-zA-Z]+/)[0];
    const productLift = copyName.match(/[a-zA-Z]+(\d+)/)
      ? copyName.match(/[a-zA-Z]+(\d+)/)[1]
      : "";
    const productImage = copyName.match(/\d+([a-zA-Z].*)/)
      ? copyName.match(/\d+([a-zA-Z].*)/)[1]
      : "";

    const link = await this.buildLinkService.buildLink({
      product,
      productLift,
      productImage,
      linkUrl: linkUrl,
    });

    return link;
  }
}
