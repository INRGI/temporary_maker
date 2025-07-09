import { AnalyticSelectionRules } from "@epc-services/interface-adapters";

export interface CreateAdminBroadcastConfigProps {
  niche: string;
  analyticSelectionRules: AnalyticSelectionRules;
}

export type AdminBroadcastConfigProps = CreateAdminBroadcastConfigProps;

export interface UpdateAdminBroadcastConfigProps {
  readonly niche: string;
  readonly analyticSelectionRules: AnalyticSelectionRules;
}
