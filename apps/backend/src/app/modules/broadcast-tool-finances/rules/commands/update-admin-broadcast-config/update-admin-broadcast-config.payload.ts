import {
  AnalyticSelectionRules,
  TestingRules,
} from "@epc-services/interface-adapters";

export interface UpdateAdminBroadcastConfigPayload {
  readonly _id: string;
  readonly niche: string;
  readonly testingRules: TestingRules;
  readonly analyticSelectionRules: AnalyticSelectionRules;
}
