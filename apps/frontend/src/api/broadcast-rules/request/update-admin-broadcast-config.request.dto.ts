import { AnalyticSelectionRules } from "../../../types/broadcast-tool";

export interface UpdateAdminBroadcastConfigRequestDto {
  niche: string;
  analyticSelectionRules: AnalyticSelectionRules;
}
