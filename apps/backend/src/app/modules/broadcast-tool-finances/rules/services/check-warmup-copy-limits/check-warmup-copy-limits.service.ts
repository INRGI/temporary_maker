import { Injectable } from "@nestjs/common";
import { CheckWarmupCopyLimitsPayload } from "./check-warmup-copy-limits.payload";

@Injectable()
export class CheckWarmupCopyLimitsService {
  public async execute(
    payload: CheckWarmupCopyLimitsPayload
  ): Promise<boolean> {
    const { copyName, broadcast } = payload;

    const cleanTargetName = this.cleanCopyName(copyName);
    if (!cleanTargetName) return false;

    const warmUpSendingLimit = 1;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        for (const copy of domain.broadcastCopies) {
          const matches = copy.copies.some(
            (c) => this.cleanCopyName(c.name) === cleanTargetName
          );
          if (matches) {
            sendingCount++;
            if (sendingCount >= warmUpSendingLimit) return false;
          }
        }
      }
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
