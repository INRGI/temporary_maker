import { Injectable } from "@nestjs/common";
import { UpdateBroadcastRulesPayload } from "./update-broadcast-rules.payload";
import { BroadcastRulesRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/broadcast-rules.repository";
import { UpdateBroadcastRulesProps } from "../../domain/types/broadcast-rules.types";

@Injectable()
export class UpdateBroadcastRulesService {
  constructor(
    private readonly broadcastRulesRepository: BroadcastRulesRepository
  ) {}

  public async execute(
    payload: UpdateBroadcastRulesPayload
  ): Promise<UpdateBroadcastRulesProps> {
    const broadcastRules = await this.broadcastRulesRepository.findById(
      payload.broadcastId
    );

    if (!broadcastRules) {
      throw new Error("Broadcast rules not found");
    }

    const updatedBroadcastRules = await this.broadcastRulesRepository.update(
      payload.broadcastId,
      {
        name: payload.name,
        broadcastSpreadsheetId: payload.broadcastSpreadsheetId,
        domainRules: payload.domainRules,
        usageRules: payload.usageRules,
        testingRules: payload.testingRules,
        partnerRules: payload.partnerRules,
        productRules: payload.productRules,
        analyticSelectionRules: payload.analyticSelectionRules,
        copyAssignmentStrategyRules: payload.copyAssignmentStrategyRules,
      }
    );

    return updatedBroadcastRules;
  }
}
