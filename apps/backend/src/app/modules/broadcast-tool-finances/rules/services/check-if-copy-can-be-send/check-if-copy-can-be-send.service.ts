import { Injectable } from '@nestjs/common';
import { CheckIfCopyCanBeSendPayload } from './check-if-copy-can-be-send.payload';

@Injectable()
export class CheckIfCopyCanBeSendService {
  public async execute(payload: CheckIfCopyCanBeSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcast,
      usageRules,
      domain,
      sendingDate,
      productRules,
    } = payload;

    const cleanCopyName = this.cleanCopyName(copyName);
    if (!cleanCopyName) return false;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        const sendingDateObj = domain.broadcastCopies.find(
          (date) => date.date === sendingDate
        );

        if (
          sendingDateObj &&
          sendingDateObj.copies.find(
            (copy) => this.cleanCopyName(copy.name) === cleanCopyName
          )
        ) {
          sendingCount++;
        }
      }
    }

    if (sendingCount >= usageRules.generalTabCopyLimit) {
      return false;
    }

    const isCopyHasSendingLimits = productRules.copySendingLimitPerDay.find(
      (copySendingLimitPerDay) => {
        if (
          this.cleanCopyName(copySendingLimitPerDay.copyName) ===
          this.cleanCopyName(copyName)
        ) {
          return true;
        }
      }
    );

    if (isCopyHasSendingLimits) {
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

      if (sendingCount >= isCopyHasSendingLimits.limit) {
        return false;
      }
    }

    return true;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : '';
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : '';
    return `${product}${productLift}`;
  }
}
