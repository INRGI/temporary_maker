import { AnalyticSelectionRules } from "@epc-services/interface-adapters";

export interface UpdateAdminBroadcastConfigPayload {
  readonly _id: string;
  readonly niche: string;
  readonly analyticSelectionRules: AnalyticSelectionRules;
}
