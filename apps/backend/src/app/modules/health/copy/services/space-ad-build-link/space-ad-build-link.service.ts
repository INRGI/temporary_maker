import { Injectable } from "@nestjs/common";
import { SpaceAdBuildLinkPayload } from "./space-ad-build-link.payload";
import { BuildLinkService } from "../build-link/build-link.service";

@Injectable()
export class SpaceAdBuildLinkService {
  constructor(private readonly buildLinkService: BuildLinkService) {}

  public async buildLink(payload: SpaceAdBuildLinkPayload): Promise<string> {
    const { copyName, linkUrl } = payload;

    const match = copyName.match(/^([a-zA-Z]+)(\d+)?_?(\d+)?$/);

    const product = match?.[1] || "";
    const productLift = match?.[2] || "";
    const productImage = match?.[3] || "";

    const link = await this.buildLinkService.buildLink({
      product,
      productLift,
      productImage,
      linkUrl: linkUrl,
    });

    return link;
  }
}
