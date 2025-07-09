import { AnalyticSelectionRules } from "../../../types/broadcast-tool";

export interface CreateAdminBroadcastConfigRequestDto {
  niche: string;
  analyticSelectionRules: AnalyticSelectionRules;
}
