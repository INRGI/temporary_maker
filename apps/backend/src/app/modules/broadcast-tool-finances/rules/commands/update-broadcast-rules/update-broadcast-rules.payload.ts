import {
  CopyAssignmentStrategyRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  UsageRules,
} from '@epc-services/interface-adapters';

export interface UpdateBroadcastRulesPayload {
  readonly _id: string;
  readonly broadcastSpreadsheetId: string;
  readonly name: string;
  readonly usageRules: UsageRules;
  readonly domainRules: DomainRules;
  readonly partnerRules: PartnerRules;
  readonly productRules: ProductRules;
  readonly copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
