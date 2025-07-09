import { IsString, Length } from "class-validator";
import { AnalyticSelectionRulesRequestDto } from "./analytic-selection-rules.request.dto";

export class UpdateAdminBroadcastConfigRequestDto {
  public _id: string;

  @IsString()
  @Length(1, 50)
  public niche: string;

  public analyticSelectionRules: AnalyticSelectionRulesRequestDto;
}
