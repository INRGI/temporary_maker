import { IsNumber } from "class-validator";

export class UsageRulesRequestDto {
  @IsNumber()
  public productMinDelayPerDays: number;

  @IsNumber()
  public copyMinDelayPerDays: number;

  @IsNumber()
  public generalTabCopyLimit: number;
}
