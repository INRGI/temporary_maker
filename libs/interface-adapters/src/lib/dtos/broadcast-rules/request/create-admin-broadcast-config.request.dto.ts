import { IsString, Length } from "class-validator";
import { AnalyticSelectionRulesRequestDto } from "./analytic-selection-rules.request.dto";
import { TestingRulesRequestDto } from "./testing-rules.request.dto";

export class CreateAdminBroadcastConfigRequestDto {
  @IsString()
  @Length(1, 50)
  public niche: string;

  public testingRules: TestingRulesRequestDto;

  public analyticSelectionRules: AnalyticSelectionRulesRequestDto;
}
