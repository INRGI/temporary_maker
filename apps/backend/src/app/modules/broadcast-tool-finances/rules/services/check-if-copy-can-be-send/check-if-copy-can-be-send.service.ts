import { Injectable } from "@nestjs/common";
import { CheckIfCopyCanBeSendPayload } from "./check-if-copy-can-be-send.payload";

@Injectable()
export class CheckIfCopyCanBeSendService {
  public async execute(payload: CheckIfCopyCanBeSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcast,
      usageRules,
      sheetName,
      sendingDate,
      productRules,
    } = payload;

    const cleanedName = this.cleanCopyName(copyName);
    if (!cleanedName) return false;

    const tabCopyLimit = usageRules.copyTabLimit?.find(
      (tab) => tab.sheetName === sheetName
    );

    if (tabCopyLimit) {
      const tabCopyCount = this.countCopiesOnDate(
        broadcast,
        sendingDate,
        cleanedName
      );
      if (tabCopyCount >= tabCopyLimit.limit) return false;
    }

    const sendingLimitRule = productRules.copySendingLimitPerDay.find(
      (rule) => this.cleanCopyName(rule.copyName) === cleanedName
    );

    if (sendingLimitRule) {
      const totalCopyCount = this.countCopiesOnDate(
        broadcast,
        sendingDate,
        cleanedName
      );
      if (totalCopyCount >= sendingLimitRule.limit) return false;
    }

    return true;
  }

  private countCopiesOnDate(
    broadcast: any,
    sendingDate: string,
    cleanedName: string
  ): number {
    let count = 0;
    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        const sendingDateObj = domain.broadcastCopies.find(
          (date) => date.date === sendingDate
        );
        if (
          sendingDateObj &&
          sendingDateObj.copies.some(
            (copy) => this.cleanCopyName(copy.name) === cleanedName
          )
        ) {
          count++;
        }
      }
    }
    return count;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
