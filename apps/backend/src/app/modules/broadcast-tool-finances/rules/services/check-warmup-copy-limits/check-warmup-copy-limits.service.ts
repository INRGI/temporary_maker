import { Injectable } from "@nestjs/common";
import { CheckWarmupCopyLimitsPayload } from "./check-warmup-copy-limits.payload";

@Injectable()
export class CheckWarmupCopyLimitsService {
  public async execute(
    payload: CheckWarmupCopyLimitsPayload
  ): Promise<boolean> {
    const { copyName, broadcast, sendingDate } = payload;

    const cleanCopyName = this.cleanCopyName(copyName);
    if (!cleanCopyName) return false;

    const warmUpSendingLimit = 1;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        const sendingDateObj = domain.broadcastCopies.find(
          (date) => date.date === sendingDate
        );

        if (
          sendingDateObj &&
          sendingDateObj.copies.find(
            (copy) =>
              this.cleanCopyName(copy.name) === this.cleanCopyName(copyName)
          )
        ) {
          sendingCount++;
        }
      }
    }

    if (sendingCount >= warmUpSendingLimit) {
      return false;
    }

    return true;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
