import { AnalyticSelectionRules } from "./analytic-selection-rules.interface";

export interface AdminBroadcastConfigEntity {
  _id: string;
  niche: string;
  analyticSelectionRules: AnalyticSelectionRules;
}
