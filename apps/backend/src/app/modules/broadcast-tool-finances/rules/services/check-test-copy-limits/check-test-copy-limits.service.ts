import { Injectable } from "@nestjs/common";
import { CheckTestCopyLimitsPayload } from "./check-test-copy-limits.payload";

@Injectable()
export class CheckTestCopyLimitsService {
  public async execute(
    payload: CheckTestCopyLimitsPayload
  ): Promise<boolean> {
    const { copyName, broadcast, testingRules } = payload;

    const cleanCopyName = this.cleanCopyName(copyName);
    if (!cleanCopyName) return false;

    const testCopySendingLimit = testingRules.similarTestCopyLimitPerDay;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        for (const copy of domain.broadcastCopies) {
          const found = copy.copies.find(
            (c) => this.cleanCopyName(c.name) === cleanCopyName
          );
          if (found) sendingCount++;
        }
      }
    }

    return sendingCount < testCopySendingLimit;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
