import { Injectable } from "@nestjs/common";
import { CheckIfSectorCanBeSendPayload } from "./check-if-sector-can-be-send.payload";

@Injectable()
export class CheckIfSectorCanBeSendService {
  public async execute(
    payload: CheckIfSectorCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      productRules,
      productsData,
      sendingDate,
    } = payload;

    const productName = this.cleanProductName(copyName);
    if (!productName || productsData.length === 0) return false;

    const productData = productsData.find(
      (product) =>
        product.productName.startsWith(`${productName} -`) ||
        product.productName.startsWith(`*${productName} -`)
    );

    if (!productData || !productData.productStatus) {
      return false;
    }

    if (productRules.blacklistedSectors.includes(productData.sector)) {
      return false;
    }

    const broadcastCopiesForDate = broadcastDomain.broadcastCopies.find(
      (copy) => copy.date === sendingDate
    );

    if (!broadcastCopiesForDate) {
      return true;
    }

    const currentSectorCopyCount = broadcastCopiesForDate.copies.reduce(
      (count, c) => {
        const cProductName = this.cleanProductName(c.name);
        const product = productsData.find(
          (p) =>
            p.productName.startsWith(`${cProductName} -`) ||
            p.productName.startsWith(`*${cProductName} -`)
        );
        return product?.sector === productData.sector ? count + 1 : count;
      },
      0
    );

    const limit = productRules.similarSectorDomainLimit;

    if (currentSectorCopyCount >= limit) {
      return false;
    }

    return true;
  }

  private cleanProductName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";

    return product;
  }
}
