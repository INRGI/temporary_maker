import {
  CopyAssignmentStrategyRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  TestingRules,
  UsageRules,
} from '@epc-services/interface-adapters';

export interface CreateBroadcastRulesProps {
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules;
  testingRules: TestingRules;
  domainRules: DomainRules;
  partnerRules: PartnerRules;
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

export type BroadcastRulesProps = CreateBroadcastRulesProps

export interface UpdateBroadcastRulesProps {
  readonly name: string;
  readonly broadcastSpreadsheetId: string;
  readonly usageRules: UsageRules;
  readonly testingRules: TestingRules;
  readonly domainRules: DomainRules;
  readonly partnerRules: PartnerRules;
  readonly productRules: ProductRules;
  readonly copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}
