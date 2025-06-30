// import { BroadcastAssignerPayload } from "./broadcast-assigner.payload";
// import { BroadcastDomain } from "@epc-services/interface-adapters";
// import { Injectable } from "@nestjs/common";
// import { VerifyCopyForDomainService } from "../../../copy-verify/services/verify-copy-for-domain/verify-copy-for-domain.service";
// import { VerifyWarmupCopyForDomainService } from "../../../copy-verify/services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";
// import { getCopyStrategyForDomain } from "../../utils/getCopyStrategyForDomain";

// @Injectable()
// export class BroadcastAssignerService {
//   constructor(
//     private readonly clickValidator: VerifyCopyForDomainService,
//     private readonly conversionValidator: VerifyCopyForDomainService,
//     private readonly testValidator: VerifyCopyForDomainService,
//     private readonly warmUpValidator: VerifyWarmupCopyForDomainService
//   ) {}

//   public async execute(
//     payload: BroadcastAssignerPayload
//   ): Promise<BroadcastDomain> {
//     let domain = payload.domain;
//     const {
//       broadcastRules,
//       date,
//       clickableCopies,
//       convertibleCopies,
//       testCopies,
//       productsData,
//       domainsData,
//       broadcast,
//       warmupCopies,
//       copiesWithoutQueue,
//       priorityCopiesData,
//     } = payload;

//     const strategy = getCopyStrategyForDomain(
//       broadcastRules.copyAssignmentStrategyRules,
//       domain.domain
//     );
    
//     if (!strategy) return domain;

//     const copiesQuantity =
//       domain.broadcastCopies.find((day) => day.date === date)?.copies.length ||
//       0;
//     if (strategy.copiesTypes.length <= copiesQuantity) {
//       return domain;
//     }

//     const added: string[] = [];

//     for (const type of strategy.copiesTypes) {
//       const pool = this.getCopyPool(type, {
//         clickableCopies,
//         convertibleCopies,
//         testCopies,
//         warmupCopies,
//       });
//       const validator = this.getValidator(type);

//       for (const copyName of pool) {
//         if (added.length >= strategy.copiesTypes.length) break;
//         if (added.includes(copyName)) continue;

//         const updatedDomain = await validator.execute({
//           broadcast,
//           broadcastDomain: domain,
//           copyName,
//           broadcastRules: broadcastRules,
//           sendingDate: date,
//           productsData,
//           domainsData,
//           priorityCopiesData,
//         });

//         if (updatedDomain.isValid) {
//           domain = {
//             ...domain,
//             broadcastCopies: updatedDomain.broadcastDomain.broadcastCopies,
//           };

//           added.push(copyName);
//         }
//       }
//     }

//     return domain;
//   }

//   private getCopyPool(
//     type: "click" | "conversion" | "test" | "warmup",
//     pools: {
//       clickableCopies: string[];
//       convertibleCopies: string[];
//       testCopies: string[];
//       warmupCopies: string[];
//     }
//   ): string[] {
//     switch (type) {
//       case "click":
//         return pools.clickableCopies;
//       case "conversion":
//         return pools.convertibleCopies;
//       case "test":
//         return pools.testCopies;
//       case "warmup":
//         return pools.warmupCopies;
//     }
//   }

//   private getValidator(type: "click" | "conversion" | "test" | "warmup") {
//     switch (type) {
//       case "click":
//         return this.clickValidator;
//       case "conversion":
//         return this.conversionValidator;
//       case "test":
//         return this.testValidator;
//       case "warmup":
//         return this.warmUpValidator;
//     }
//   }
// }


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
    const copiesQuantity = currentDay?.copies.length || 0;

    if (strategy.copiesTypes.length <= copiesQuantity) {
      return domain;
    }

    /**
    |--------------------------------------------------
    | Adding copies without queue
    |--------------------------------------------------
    */
    if (strategy.copiesTypes.length >= MIN_REQUIRED_COPIES_FOR_QUEUE) {
      const queueCopies = [...copiesWithoutQueue];

      while (queueCopies.length) {
        const idx = Math.floor(Math.random() * queueCopies.length);
        const { copyName, limit } = queueCopies[idx];

        const currentCount = currentDay?.copies.filter((c) => c.name === copyName).length || 0;
        if (currentCount >= limit) {
          queueCopies.splice(idx, 1);
          continue;
        }

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
        }

        queueCopies.splice(idx, 1);
      }
    }

    /**
    |--------------------------------------------------
    | Adding copies with queue
    |--------------------------------------------------
    */
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
