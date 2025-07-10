import { AnalyticSelectionRules } from "./analytic-selection-rules.interface";
import { TestingRules } from "./testing-rules.interface";

export interface AdminBroadcastConfigEntity {
  _id: string;
  niche: string;
  testingRules: TestingRules;
  analyticSelectionRules: AnalyticSelectionRules;
}
