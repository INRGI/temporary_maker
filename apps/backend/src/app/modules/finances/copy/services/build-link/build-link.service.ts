import { Injectable } from "@nestjs/common";
import { BuildLinkPayload } from "./build-link.payload";

@Injectable()
export class BuildLinkService {

  public async buildLink(payload: BuildLinkPayload): Promise<string> {
    const { product, productLift, linkUrl, productImage, trackingData } = payload;
    

    if (linkUrl.productCode === "PRODUCT#IMAGE" && trackingData.trackingData) {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "IMG0000_#IMAGE" && trackingData.trackingData) {
      if (!trackingData.imgData) return "urlhere";
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}IMG${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "0000_#IMAGE" && trackingData.trackingData) {
      if (!trackingData.imgData) return "urlhere";
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "000_#IMAGE" && trackingData.trackingData) {
      if (!trackingData.imgData) return "urlhere";
      return `${linkUrl.linkStart}${trackingData.trackingData}${
        linkUrl.linkEnd
      }${trackingData.imgData.slice(1)}_${productLift}${productImage}`;
    }

    if (
      linkUrl.productCode === "TRACKINGID_#IMAGE" &&
      trackingData.trackingData
    ) {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.trackingData}_${productLift}${productImage}`;
    }

    return "urlhere";
  }

  public async buildLinkWithDataProvided(
    payload: BuildLinkPayload
  ): Promise<string> {
    const { product, productLift, linkUrl, productImage, mondayProductsData } =
      payload;
    let trackingData: { trackingData: string; imgData: string };

    trackingData = mondayProductsData?.find((item) =>
      item.product.startsWith(`${product} -`)
    );

    if (!trackingData) {
      trackingData = mondayProductsData?.find((item) =>
        item.product.startsWith(`*${product} -`)
      );
      if (!trackingData.trackingData) {
        return "urlhere";
      }
    }

    if (!trackingData.trackingData) {
      return "urlhere";
    }
    if (linkUrl.productCode === "PRODUCT#IMAGE") {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${product}${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "IMG0000_#IMAGE") {
      if (!trackingData.imgData) return "urlhere";
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}IMG${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "0000_#IMAGE") {
      if (!trackingData.imgData) return "urlhere";
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.imgData}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "000_#IMAGE") {
      if (!trackingData.imgData) return "urlhere";
      return `${linkUrl.linkStart}${trackingData.trackingData}${
        linkUrl.linkEnd
      }${trackingData.imgData.slice(1)}_${productLift}${productImage}`;
    }

    if (linkUrl.productCode === "TRACKINGID_#IMAGE") {
      return `${linkUrl.linkStart}${trackingData.trackingData}${linkUrl.linkEnd}${trackingData.trackingData}_${productLift}${productImage}`;
    }

    return "urlhere";
  }

  public checkIfForValidation(payload: {
    product: string;
    mondayProductsData?: {
      product: string;
      trackingData: string;
      imgData: string;
      isForValidation?: boolean;
    }[];
  }): boolean {
    const { product, mondayProductsData } = payload;
    const trackingData = mondayProductsData?.find((item) =>
      item.product.startsWith(`${product} -`)
    );
    if (!trackingData || !trackingData.product) {
      const trackingData = mondayProductsData?.find((item) =>
        item.product.startsWith(`*${product} -`)
      );
      
      if (!trackingData || !trackingData.product) return false;
      return trackingData?.isForValidation;
    }
    return trackingData?.isForValidation;
  }
}
