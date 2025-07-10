import {
  AnalyticSelectionRules,
  TestingRules,
} from "../../../types/broadcast-tool";

export interface CreateAdminBroadcastConfigRequestDto {
  niche: string;
  testingRules: TestingRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
