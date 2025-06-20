import { AnalyticSelectionRules } from "./analytic-selection-rules.interface";
import { CopyAssignmentStrategyRules } from "./copy-assignment-strategy-rules.interface";
import { DomainRules } from "./domain-rules.interface";
import { PartnerRules } from "./partner-rules.interface";
import { ProductRules } from "./product-rules.interface";
import { TestingRules } from "./testing-rules.interface";
import { UsageRules } from "./usage-rules.interface";

export interface BroadcastRulesEntity {
  id: string;
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
