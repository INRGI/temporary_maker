import { BroadcastAssignerPayload } from "./broadcast-assigner.payload";
import { BroadcastDomain } from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { getCopyStrategyForDay } from "../../utils/getCopyStrategyForDay";
import { VerifyCopyForDomainService } from "../../../copy-verify/services/verify-copy-for-domain/verify-copy-for-domain.service";
import { VerifyWarmupCopyForDomainService } from "../../../copy-verify/services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";

@Injectable()
export class BroadcastAssignerService {
  constructor(
    private readonly clickValidator: VerifyCopyForDomainService,
    private readonly conversionValidator: VerifyCopyForDomainService,
    private readonly testValidator: VerifyCopyForDomainService,
    private readonly warmUpValidator: VerifyWarmupCopyForDomainService
  ) {}

  public async execute(
    payload: BroadcastAssignerPayload
  ): Promise<BroadcastDomain> {
    let domain = payload.domain;
    const {
      broadcastRules,
      date,
      clickableCopies,
      convertibleCopies,
      testCopies,
      productsData,
      domainsData,
      broadcast,
      warmupCopies,
      copiesWithoutQueue,
      priorityCopiesData,
    } = payload;

    const strategy = getCopyStrategyForDay(
      broadcastRules.copyAssignmentStrategyRules,
      domain.sendingCopiesPerDay
    );
    if (!strategy) return domain;

    const copiesQuantity =
      domain.broadcastCopies.find((day) => day.date === date)?.copies.length ||
      0;
    if (domain.sendingCopiesPerDay <= copiesQuantity) {
      return domain;
    }

    const added: string[] = [];

    for (const type of strategy.copiesTypes) {
      const pool = this.getCopyPool(type, {
        clickableCopies,
        convertibleCopies,
        testCopies,
        warmupCopies,
      });
      const validator = this.getValidator(type);

      for (const copyName of pool) {
        if (added.length >= strategy.copiesTypes.length) break;
        if (added.includes(copyName)) continue;

        const updatedDomain = await validator.execute({
          broadcast,
          broadcastDomain: domain,
          copyName,
          broadcastRules: broadcastRules,
          sendingDate: date,
          productsData,
          domainsData,
          priorityCopiesData,
        });

        if (updatedDomain.isValid) {
          domain = {
            ...domain,
            broadcastCopies: updatedDomain.broadcastDomain.broadcastCopies,
          };

          added.push(copyName);
        }
      }
    }

    return domain;
  }

  private getCopyPool(
    type: "click" | "conversion" | "test" | "warmup",
    pools: {
      clickableCopies: string[];
      convertibleCopies: string[];
      testCopies: string[];
      warmupCopies: string[];
    }
  ): string[] {
    switch (type) {
      case "click":
        return pools.clickableCopies;
      case "conversion":
        return pools.convertibleCopies;
      case "test":
        return pools.testCopies;
      case "warmup":
        return pools.warmupCopies;
    }
  }

  private getValidator(type: "click" | "conversion" | "test" | "warmup") {
    switch (type) {
      case "click":
        return this.clickValidator;
      case "conversion":
        return this.conversionValidator;
      case "test":
        return this.testValidator;
      case "warmup":
        return this.warmUpValidator;
    }
  }
}
