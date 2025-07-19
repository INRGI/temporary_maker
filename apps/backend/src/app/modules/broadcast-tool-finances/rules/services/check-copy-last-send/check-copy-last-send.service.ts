import { Injectable } from "@nestjs/common";
import { CheckCopyLastSendPayload } from "./check-copy-last-send.payload";

@Injectable()
export class CheckCopyLastSendService {
  async execute(payload: CheckCopyLastSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      possibleSendingDate,
      copyMinDelayPerDays,
    } = payload;

    const targetName = this.cleanCopyName(copyName);
    let latestDate: string | null = null;

    for (const copyEntry of broadcastDomain.broadcastCopies) {
      const hasMatch = copyEntry.copies.some(
        (c) => this.cleanCopyName(c.name) === targetName
      );
      if (hasMatch) {
        if (!latestDate || copyEntry.date > latestDate) {
          latestDate = copyEntry.date;
        }
      }
    }

    if (!latestDate) return true;

    const lastDate = new Date(latestDate);
    const possibleDate = new Date(possibleSendingDate);
    const diffDays = Math.round(
      (possibleDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    );

    return diffDays >= copyMinDelayPerDays;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
