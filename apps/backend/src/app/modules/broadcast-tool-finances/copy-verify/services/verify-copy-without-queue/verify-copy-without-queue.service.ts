import { Injectable } from "@nestjs/common";
import { CheckCopyLastSendService } from "../../../rules/services/check-copy-last-send/check-copy-last-send.service";
import { CheckProductLastSendService } from "../../../rules/services/check-product-last-send/check-product-last-send.service";
import { CheckIfProductCanBeSendService } from "../../../rules/services/check-if-product-can-be-send/check-if-product-can-be-send.service";
import { CheckIfCopyCanBeSendService } from "../../../rules/services/check-if-copy-can-be-send/check-if-copy-can-be-send.service";
import { CheckIfDomainActiveService } from "../../../rules/services/check-if-domain-active/check-if-domain-active.service";
import { CheckIfCopyBlacklistedService } from "../../../rules/services/check-if-copy-blacklisted/check-if-copy-blacklisted.service";
import { CopyType, VerifyCopyForDomainResponseDto } from "@epc-services/interface-adapters";
import { CheckIfProductPriorityService } from "../../../rules/services/check-if-product-priority/check-if-product-priority.service";
import { VerifyCopyWithoutQueuePayload } from "./verify-copy-without-queue.payload";
import { CheckIfPartnerCanBeSendService } from "../../../rules/services/check-if-partner-can-be-send/check-if-partner-can-be-send.service";
import { CheckIfSectorCanBeSendService } from "../../../rules/services/check-if-sector-can-be-send/check-if-sector-can-be-send.service";

@Injectable()
export class VerifyCopyWithoutQueueService {
  constructor(
    private readonly checkCopyLastSendService: CheckCopyLastSendService,
    private readonly checkProductLastSendService: CheckProductLastSendService,
    private readonly checkIfProductCanBeSendService: CheckIfProductCanBeSendService,
    private readonly checkIfCopyCanBeSendService: CheckIfCopyCanBeSendService,
    private readonly checkIfDomainActiveService: CheckIfDomainActiveService,
    private readonly checkIfCopyBlacklistedService: CheckIfCopyBlacklistedService,
    private readonly checkIfProductPriorityService: CheckIfProductPriorityService,
    private readonly checkIfPartnerCanBeSendService: CheckIfPartnerCanBeSendService,
    private readonly checkIfSectorCanBeSendService: CheckIfSectorCanBeSendService
  ) {}
  public async execute(
    payload: VerifyCopyWithoutQueuePayload
  ): Promise<VerifyCopyForDomainResponseDto> {
    const {
      broadcastDomain,
      copyName,
      sheetName,
      broadcastRules,
      sendingDate,
      productsData,
      domainsData,
      broadcast,
      priorityCopiesData,
    } = payload;

    const checkIfCopyBlacklistedServiceResult =
      await this.checkIfCopyBlacklistedService.execute({
        copyName,
        blacklistedCopies: broadcastRules.productRules.blacklistedCopies,
      });

    if (checkIfCopyBlacklistedServiceResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfDomainActiveResult =
      await this.checkIfDomainActiveService.execute({
        domainRules: broadcastRules.domainRules,
        domain: broadcastDomain.domain,
        broadcast: broadcast,
        sendingDate,
        domainsData,
      });

    if (!checkIfDomainActiveResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfPartnerCanBeSendServiceResult =
      await this.checkIfPartnerCanBeSendService.execute({
        copyName,
        broadcastDomain,
        partnerRules: broadcastRules.partnerRules,
        productsData,
        sendingDate,
      });

    if (!checkIfPartnerCanBeSendServiceResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfSectorCanBeSendServiceResult =
      await this.checkIfSectorCanBeSendService.execute({
        copyName,
        broadcastDomain,
        productRules: broadcastRules.productRules,
        productsData,
        sendingDate,
      });

    if (!checkIfSectorCanBeSendServiceResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfProductCanBeSendResult =
      await this.checkIfProductCanBeSendService.execute({
        copyName,
        broadcast,
        productRules: broadcastRules.productRules,
        domain: broadcastDomain.domain,
        domainsData,
        productsData,
        sendingDate,
      });

    if (!checkIfProductCanBeSendResult) {
      return { isValid: false, broadcastDomain };
    }

    const isCopyHasSendingLimits =
      broadcastRules.productRules.copySendingLimitPerDay.find(
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
        return { isValid: false, broadcastDomain };
      }
    }

    const checkCopyLastSendResult = await this.checkCopyLastSendService.execute(
      {
        copyName,
        broadcastDomain,
        possibleSendingDate: sendingDate,
        copyMinDelayPerDays: broadcastRules.usageRules.copyMinDelayPerDays,
      }
    );
    if (!checkCopyLastSendResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkProductLastSendResult =
      await this.checkProductLastSendService.execute({
        copyName,
        broadcastDomain,
        possibleSendingDate: sendingDate,
        productMinDelayPerDays:
          broadcastRules.usageRules.productMinDelayPerDays,
      });

    if (!checkProductLastSendResult) {
      return { isValid: false, broadcastDomain };
    }

    const isCopyPriority = await this.checkIfProductPriorityService.execute({
      product: this.cleanProductName(copyName),
      priorityCopiesData,
    });

    let existingDate = broadcastDomain.broadcastCopies.find(
      (b) => b.date === sendingDate
    );

    if (!existingDate) {
      existingDate = {
        date: sendingDate,
        copies: [],
        isModdified: false,
        possibleReplacementCopies: [],
      };

      broadcastDomain.broadcastCopies.push(existingDate);
    }

    const updatedBroadcastCopies = broadcastDomain.broadcastCopies.map(
      (broadcastCopy) => {
        if (
          new Date(broadcastCopy.date).getUTCDate() ===
            new Date(sendingDate).getUTCDate() &&
          new Date(broadcastCopy.date).getUTCDay() ===
            new Date(sendingDate).getUTCDay()
        ) {
          return {
            ...broadcastCopy,
            copies: [
              ...broadcastCopy.copies,
              { name: copyName, isPriority: isCopyPriority, copyType: CopyType.Unknown },
            ],
            isModdified: true,
          };
        }
        return broadcastCopy;
      }
    );

    const isBroadcastCopyAdded = updatedBroadcastCopies.some(
      (broadcastCopy) =>
        broadcastCopy.date === sendingDate &&
        broadcastCopy.copies.some((copy) => copy.name === copyName)
    );

    if (!isBroadcastCopyAdded) {
      return { isValid: false, broadcastDomain };
    }

    return {
      isValid: true,
      broadcastDomain: {
        ...broadcastDomain,
        broadcastCopies: updatedBroadcastCopies,
      },
    };
  }

  private cleanProductName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";

    return product;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
