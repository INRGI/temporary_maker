import { Injectable } from '@nestjs/common';
import { CheckCopyLastSendPayload } from './check-copy-last-send.payload';

@Injectable()
export class CheckCopyLastSendService {
  async execute(payload: CheckCopyLastSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      possibleSendingDate,
      copyMinDelayPerDays,
    } = payload;


    const lastCopySend = broadcastDomain.broadcastCopies
      .filter((copy) => copy.copies.find((copy) => this.cleanCopyName(copy.name) === this.cleanCopyName(copyName)))
      .reduce(
        (prev, current) => (prev && prev.date > current.date ? prev : current),
        null
      );

    if (!lastCopySend) {
      return true;
    }

    const lastCopySendDate = new Date(lastCopySend.date);
    const possibleSendingDateObj = new Date(possibleSendingDate);
    
    const diffInMilliseconds =
      possibleSendingDateObj.getTime() - lastCopySendDate.getTime();
    const diffInDays = Math.round(diffInMilliseconds / (1000 * 3600 * 24));

    return diffInDays >= copyMinDelayPerDays;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
