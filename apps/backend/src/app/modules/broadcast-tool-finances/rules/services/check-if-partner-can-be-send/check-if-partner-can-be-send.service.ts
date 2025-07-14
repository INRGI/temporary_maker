import { Injectable } from "@nestjs/common";
import { CheckIfPartnerCanBeSendPayload } from "./check-if-partner-can-be-send.payload";

@Injectable()
export class CheckIfPartnerCanBeSendService {
  public async execute(
    payload: CheckIfPartnerCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      partnerRules,
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

    if (partnerRules.blacklistedPartners.includes(productData.partner)) {
      return false;
    }

    const isPartnerHasSendingRestrictions =
      partnerRules.partnerAllowedSendingDays.find(
        (partnerAllowedSendingDay) => {
          if (partnerAllowedSendingDay.partner === productData.partner) {
            return true;
          }
        }
      );

    if (isPartnerHasSendingRestrictions) {
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
      if (!isPartnerHasSendingRestrictions.allowedSendingDays[dayOfWeek]) {
        return false;
      }
    }

    const broadcastCopiesForDate = broadcastDomain.broadcastCopies.find(
      (copy) => copy.date === sendingDate
    );

    if (!broadcastCopiesForDate) {
      return true;
    }

    const currentPartnerCopyCount = broadcastCopiesForDate.copies.reduce(
      (count, c) => {
        const cProductName = this.cleanProductName(c.name);
        const product = productsData.find(
          (p) =>
            p.productName.startsWith(`${cProductName} -`) ||
            p.productName.startsWith(`*${cProductName} -`)
        );
        return product?.partner === productData.partner ? count + 1 : count;
      },
      0
    );

    const limit = partnerRules.similarPartnerDomainLimit;

    if (currentPartnerCopyCount >= limit) {
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
