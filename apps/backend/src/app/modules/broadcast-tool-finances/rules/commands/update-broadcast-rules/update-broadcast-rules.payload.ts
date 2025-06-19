import {
  AnalyticSelectionRules,
  CopyAssignmentStrategyRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  TestingRules,
  UsageRules,
} from '@epc-services/interface-adapters';

export interface UpdateBroadcastRulesPayload {
  readonly broadcastId: string;
  readonly broadcastSpreadsheetId: string;
  readonly name: string;
  readonly usageRules: UsageRules;
  readonly testingRules: TestingRules;
  readonly domainRules: DomainRules;
  readonly partnerRules: PartnerRules;
  readonly productRules: ProductRules;
  readonly analyticSelectionRules: AnalyticSelectionRules;
  readonly copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
