import {
  AnalyticSelectionRules,
  TestingRules,
} from "../../../types/broadcast-tool";

export interface AdminBroadcastConfigResponseDto {
  _id: string;
  niche: string;
  testingRules: TestingRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
