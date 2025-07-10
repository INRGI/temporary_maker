import { CopyAssignmentStrategyRules } from "./copy-assignment-strategy-rules.interface";
import { DomainRules } from "./domain-rules.interface";
import { PartnerRules } from "./partner-rules.interface";
import { ProductRules } from "./product-rules.interface";
import { UsageRules } from "./usage-rules.interface";

export interface BroadcastRulesEntity {
  _id: string;
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules; 
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
