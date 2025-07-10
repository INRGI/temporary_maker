import {
  AnalyticSelectionRules,
  TestingRules,
} from "../../../types/broadcast-tool";

export interface UpdateAdminBroadcastConfigRequestDto {
  niche: string;
  testingRules: TestingRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
