import {
  CopyAssignmentStrategyRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  UsageRules,
} from "../../../types/broadcast-tool";

export interface CreateBroadcastRulesRequest {
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
