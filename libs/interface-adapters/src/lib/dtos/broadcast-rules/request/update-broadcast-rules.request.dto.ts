import { IsString, Length } from "class-validator";
import { UsageRulesRequestDto } from "./usage-rules.request.dto";
import { TestingRulesRequestDto } from "./testing-rules.request.dto";
import { DomainRulesRequestDto } from "./domain-rules.request.dto";
import { PartnerRulesRequestDto } from "./partner-rules.request.dto";
import { ProductRulesRequestDto } from "./product-rules.request.dto";
import { AnalyticSelectionRulesRequestDto } from "./analytic-selection-rules.request.dto";
import { CopyAssignmentStrategyRulesRequestDto } from "./copy-assignment-strategy-rules.request.dto";

export class UpdateBroadcastRulesRequestDto {
  public _id: string;

  @IsString()
  @Length(1, 50)
  public name: string;

  @IsString()
  public broadcastSpreadsheetId: string;

  public usageRules: UsageRulesRequestDto;

  public testingRules: TestingRulesRequestDto;

  public domainRules: DomainRulesRequestDto;

  public partnerRules: PartnerRulesRequestDto;

  public productRules: ProductRulesRequestDto;

  public analyticSelectionRules: AnalyticSelectionRulesRequestDto;

  public copyAssignmentStrategyRules: CopyAssignmentStrategyRulesRequestDto;
}
