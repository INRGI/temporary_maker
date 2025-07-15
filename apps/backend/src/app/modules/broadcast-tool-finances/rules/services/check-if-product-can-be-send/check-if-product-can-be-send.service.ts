import { Injectable } from "@nestjs/common";
import { CheckIfProductCanBeSendPayload } from "./check-if-product-can-be-send.payload";

@Injectable()
export class CheckIfProductCanBeSendService {
  public async execute(
    payload: CheckIfProductCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcast,
      productRules,
      domainRules,
      domain,
      domainsData,
      productsData,
      sendingDate,
    } = payload;

    const productName = this.cleanProductName(copyName);
    if (!productName || domainsData.length === 0 || productsData.length === 0)
      return false;

    const productData = productsData.find(
      (product) =>
        product.productName.startsWith(`${productName} -`) ||
        product.productName.startsWith(`*${productName} -`)
    );

    const domainData = domainsData.find(
      (domainName) =>
        this.normalizeDomain(domain) ===
          this.normalizeDomain(domainName.domainName) ||
        domainName.domainName.trim().endsWith(`_${domain}`) ||
        domainName.domainName.trim().endsWith(`-${domain}`)
    );

    const isProductHasSendingLimits =
      productRules.productsSendingLimitPerDay.find(
        (productSendingLimitPerDay) => {
          if (productSendingLimitPerDay.productName === productName) {
            return true;
          }
        }
      );

    if (isProductHasSendingLimits) {
      let sendingCount = 0;

      for (const sheet of broadcast.sheets) {
        for (const domain of sheet.domains) {
          const sendingDateObj = domain.broadcastCopies.find(
            (date) => date.date === sendingDate
          );

          if (
            sendingDateObj &&
            sendingDateObj.copies.find(
              (copy) => this.cleanProductName(copy.name) === productName
            )
          ) {
            sendingCount++;
          }
        }
      }

      if (sendingCount >= isProductHasSendingLimits.limit) {
        return false;
      }
    }

    const isProductHasSendingRestrictions =
      productRules.productAllowedSendingDays.find(
        (productAllowedSendingDay) => {
          if (productAllowedSendingDay.product === productName) {
            return true;
          }
        }
      );

    if (isProductHasSendingRestrictions) {
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayOfWeek = daysOfWeek[new Date(sendingDate).getDay()];
      if (!isProductHasSendingRestrictions.allowedSendingDays[dayOfWeek]) {
        return false;
      }
    }

    if (
      !productData ||
      !domainData ||
      !productData.productStatus ||
      !domainData.domainStatus
    ) {
      return false;
    }

    if (
      productRules.allowedMondayStatuses.includes(productData.productStatus) &&
      domainRules.domainSending.some(
        (domainSending) =>
          domainSending.parentCompany === domainData.parentCompany &&
          domainSending.allowedMondayStatuses.includes(productData.domainSending)
      )
    ) {
      return true;
    }    

    return false;
  }

  private cleanProductName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";

    return product;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
