import {
  AnalyticSelectionRules,
  CopyAssignmentStrategyRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  TestingRules,
  UsageRules,
} from "../../../types/broadcast-tool";

export interface CreateBroadcastRulesRequest {
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules;
  testingRules: TestingRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  productRules: ProductRules;
  analyticSelectionRules: AnalyticSelectionRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
