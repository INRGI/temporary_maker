import { IsString, Length } from "class-validator";
import { AnalyticSelectionRulesRequestDto } from "../request/analytic-selection-rules.request.dto";

export class AdminBroadcastConfigResponseDto {
  @IsString()
  @Length(1, 50)
  public niche: string;

  public analyticSelectionRules: AnalyticSelectionRulesRequestDto;
}
