import { AnalyticSelectionRules } from "../../../types/broadcast-tool";

export interface AdminBroadcastConfigResponseDto {
  _id: string;
  niche: string;
  analyticSelectionRules: AnalyticSelectionRules;
}
