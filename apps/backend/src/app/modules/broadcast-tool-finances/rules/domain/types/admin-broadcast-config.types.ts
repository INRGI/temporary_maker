import {
  AnalyticSelectionRules,
  TestingRules,
} from "@epc-services/interface-adapters";

export interface CreateAdminBroadcastConfigProps {
  niche: string;
  testingRules: TestingRules;
  analyticSelectionRules: AnalyticSelectionRules;
}

export type AdminBroadcastConfigProps = CreateAdminBroadcastConfigProps;

export interface UpdateAdminBroadcastConfigProps {
  readonly niche: string;
  readonly testingRules: TestingRules;
  readonly analyticSelectionRules: AnalyticSelectionRules;
}
