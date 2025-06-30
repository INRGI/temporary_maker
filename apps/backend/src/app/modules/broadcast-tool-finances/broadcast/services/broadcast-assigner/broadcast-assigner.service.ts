import { BroadcastAssignerPayload } from "./broadcast-assigner.payload";
import { BroadcastDomain } from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { VerifyCopyForDomainService } from "../../../copy-verify/services/verify-copy-for-domain/verify-copy-for-domain.service";
import { VerifyWarmupCopyForDomainService } from "../../../copy-verify/services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";
import { getCopyStrategyForDomain } from "../../utils/getCopyStrategyForDomain";

const MIN_REQUIRED_COPIES_FOR_QUEUE = 2;

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

    const strategy = getCopyStrategyForDomain(
      broadcastRules.copyAssignmentStrategyRules,
      domain.domain
    );

    if (!strategy) return domain;

    const currentDay = domain.broadcastCopies.find((day) => day.date === date);
    let copiesQuantity = currentDay?.copies.length || 0;
    const maxCopiesPerDay = strategy.copiesTypes.length;
    const added: string[] = [];

    if (maxCopiesPerDay >= MIN_REQUIRED_COPIES_FOR_QUEUE) {
      const shuffledQueue = this.shuffleArray([...copiesWithoutQueue]);

      for (const { copyName, limit } of shuffledQueue) {
        if (copiesQuantity >= maxCopiesPerDay) break;

        const currentCount = currentDay?.copies.filter((c) => c.name === copyName).length || 0;
        if (currentCount >= limit) continue;

        const result = await this.clickValidator.execute({
          broadcast,
          broadcastDomain: domain,
          copyName,
          broadcastRules,
          sendingDate: date,
          productsData,
          domainsData,
          priorityCopiesData,
        });

        if (result.isValid) {
          domain = {
            ...domain,
            broadcastCopies: result.broadcastDomain.broadcastCopies,
          };
          copiesQuantity++;
        }
      }
    }

    for (const type of strategy.copiesTypes) {
      if (copiesQuantity >= maxCopiesPerDay) break;

      const pool = this.getCopyPool(type, {
        clickableCopies,
        convertibleCopies,
        testCopies,
        warmupCopies,
      });
      const validator = this.getValidator(type);

      for (const copyName of pool) {
        if (copiesQuantity >= maxCopiesPerDay) break;
        if (added.includes(copyName)) continue;

        const result = await validator.execute({
          broadcast,
          broadcastDomain: domain,
          copyName,
          broadcastRules,
          sendingDate: date,
          productsData,
          domainsData,
          priorityCopiesData,
        });

        if (result.isValid) {
          domain = {
            ...domain,
            broadcastCopies: result.broadcastDomain.broadcastCopies,
          };
          added.push(copyName);
          copiesQuantity++;
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

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
