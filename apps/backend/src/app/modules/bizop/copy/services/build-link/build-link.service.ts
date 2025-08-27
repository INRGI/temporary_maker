import { Injectable } from "@nestjs/common";
import { BuildLinkPayload } from "./build-link.payload";

@Injectable()
export class BuildLinkService {
  public async buildLink(payload: BuildLinkPayload): Promise<string> {
    const { product, productLift, linkUrl, productImage } = payload;

    return `${linkUrl.linkStart}${product}${linkUrl.linkEnd}${product}${productLift}${productImage}/`;
  }

  public async buildLinkWithDataProvided(
    payload: BuildLinkPayload
  ): Promise<string> {
    const { product, productLift, linkUrl, productImage } = payload;

    return `${linkUrl.linkStart}${product}${linkUrl.linkEnd}${product}${productLift}${productImage}/`;
  }
}
