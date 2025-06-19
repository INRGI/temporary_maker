import { IsString, Length } from "class-validator";
import { UsageRulesRequestDto } from "../request/usage-rules.request.dto";
import { TestingRulesRequestDto } from "../request/testing-rules.request.dto";
import { DomainRulesRequestDto } from "../request/domain-rules.request.dto";
import { PartnerRulesRequestDto } from "../request/partner-rules.request.dto";
import { ProductRulesRequestDto } from "../request/product-rules.request.dto";
import { AnalyticSelectionRulesRequestDto } from "../request/analytic-selection-rules.request.dto";
import { CopyAssignmentStrategyRulesRequestDto } from "../request/copy-assignment-strategy-rules.request.dto";

export class BroadcastRulesResponseDto {
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
