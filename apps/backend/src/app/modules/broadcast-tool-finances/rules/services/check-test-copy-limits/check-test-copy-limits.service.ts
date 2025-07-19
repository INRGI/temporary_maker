import { Injectable } from "@nestjs/common";
import { CheckTestCopyLimitsPayload } from "./check-test-copy-limits.payload";

@Injectable()
export class CheckTestCopyLimitsService {
  public async execute(payload: CheckTestCopyLimitsPayload): Promise<boolean> {
    const { copyName, broadcast, testingRules } = payload;

    const cleanTargetName = this.cleanCopyName(copyName);
    if (!cleanTargetName) return false;

    const testCopySendingLimit = testingRules.similarTestCopyLimitPerDay;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        for (const copy of domain.broadcastCopies) {
          const matches = copy.copies.some(
            (c) => this.cleanCopyName(c.name) === cleanTargetName
          );
          if (matches) {
            sendingCount++;
            if (sendingCount >= testCopySendingLimit) return false;
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
