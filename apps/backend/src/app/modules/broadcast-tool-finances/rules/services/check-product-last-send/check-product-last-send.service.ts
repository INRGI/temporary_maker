import { Injectable } from '@nestjs/common';
import { CheckProductLastSendPayload } from './check-product-last-send.payload';

@Injectable()
export class CheckProductLastSendService {
  async execute(payload: CheckProductLastSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      possibleSendingDate,
      productMinDelayPerDays,
    } = payload;

    const lastProductSend = broadcastDomain.broadcastCopies
      .filter((copy) =>
        copy.copies.find(
          (copy) =>
            this.cleanProductName(copy.name) === this.cleanProductName(copyName)
        )
      )
      .reduce(
        (prev, current) => (prev && prev.date > current.date ? prev : current),
        null
      );

    if (!lastProductSend) {
      return true;
    }

    const lastCopySendDate = new Date(lastProductSend.date);
    const possibleSendingDateObj = new Date(possibleSendingDate);

    const diffInMilliseconds =
      possibleSendingDateObj.getTime() - lastCopySendDate.getTime();
    const diffInDays = Math.round(diffInMilliseconds / (1000 * 3600 * 24));

    return diffInDays >= productMinDelayPerDays;
  }

  private cleanProductName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : '';

    return product;
  }
}
