import { Injectable } from "@nestjs/common";
import { ReverifyCopyPayload } from "./reverify-copy.payload";
import { CheckCopyLastSendService } from "../../../rules/services/check-copy-last-send/check-copy-last-send.service";
import { CheckProductLastSendService } from "../../../rules/services/check-product-last-send/check-product-last-send.service";
import { CheckIfProductCanBeSendService } from "../../../rules/services/check-if-product-can-be-send/check-if-product-can-be-send.service";
import { CheckIfDomainActiveService } from "../../../rules/services/check-if-domain-active/check-if-domain-active.service";
import { CheckIfCopyBlacklistedService } from "../../../rules/services/check-if-copy-blacklisted/check-if-copy-blacklisted.service";
import { CheckIfPartnerCanBeSendService } from "../../../rules/services/check-if-partner-can-be-send/check-if-partner-can-be-send.service";
import { CheckIfSectorCanBeSendService } from "../../../rules/services/check-if-sector-can-be-send/check-if-sector-can-be-send.service";
import { CheckIfCopyCanBeSendService } from "../../../rules/services/check-if-copy-can-be-send/check-if-copy-can-be-send.service";

@Injectable()
export class ReverifyCopyService {
  constructor(
    private readonly checkCopyLastSendService: CheckCopyLastSendService,
    private readonly checkProductLastSendService: CheckProductLastSendService,
    private readonly checkIfProductCanBeSendService: CheckIfProductCanBeSendService,
    private readonly checkIfCopyCanBeSendService: CheckIfCopyCanBeSendService,
    private readonly checkIfDomainActiveService: CheckIfDomainActiveService,
    private readonly checkIfCopyBlacklistedService: CheckIfCopyBlacklistedService,
    private readonly checkIfPartnerCanBeSendService: CheckIfPartnerCanBeSendService,
    private readonly checkIfSectorCanBeSendService: CheckIfSectorCanBeSendService
  ) {}
  public async execute(payload: ReverifyCopyPayload): Promise<boolean> {
    const {
      sendingDate,
      sheetName,
      copyName,
      broadcast,
      broadcastRules,
      adminBroadcastConfig,
      broadcastDomain,
      domainsData,
      productsData,
    } = payload;

    const checkIfCopyBlacklistedServiceResult =
      await this.checkIfCopyBlacklistedService.execute({
        copyName,
        blacklistedCopies: broadcastRules.productRules.blacklistedCopies,
      });

    if (checkIfCopyBlacklistedServiceResult) {
      return false;
    }

    const checkIfDomainActiveResult =
      await this.checkIfDomainActiveService.execute({
        domainRules: adminBroadcastConfig.domainRules,
        domain: broadcastDomain.domain,
        broadcast: broadcast,
        sendingDate,
        domainsData,
      });

    if (!checkIfDomainActiveResult) {
      return false;
    }

    const checkIfPartnerCanBeSendServiceResult =
      await this.checkIfPartnerCanBeSendService.execute({
        copyName,
        broadcastDomain,
        partnerRules: adminBroadcastConfig.partnerRules,
        productsData,
        sendingDate,
      });

    if (!checkIfPartnerCanBeSendServiceResult) {
      return false;
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
      return false;
    }

    const checkIfProductCanBeSendResult =
      await this.checkIfProductCanBeSendService.execute({
        copyName,
        broadcast,
        domainRules: adminBroadcastConfig.domainRules,
        productRules: broadcastRules.productRules,
        domain: broadcastDomain.domain,
        domainsData,
        productsData,
        sendingDate,
      });

    if (!checkIfProductCanBeSendResult) {
      return false;
    }

    const checkIfCopyCanBeSendResult =
      await this.checkIfCopyCanBeSendService.execute({
        copyName,
        broadcast,
        sheetName,
        usageRules: broadcastRules.usageRules,
        domain: broadcastDomain.domain,
        sendingDate,
        productRules: broadcastRules.productRules,
      });

    if (!checkIfCopyCanBeSendResult) {
      return false;
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
      return false;
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
      return false;
    }

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

    return true;
  }
}
