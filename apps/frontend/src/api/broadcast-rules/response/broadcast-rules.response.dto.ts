import {
  AnalyticSelectionRules,
  CopyAssignmentStrategyRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  UsageRules,
} from "../../../types/broadcast-tool";

export interface BroadcastRulesResponse {
  _id: string;
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  productRules: ProductRules;
  analyticSelectionRules: AnalyticSelectionRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
