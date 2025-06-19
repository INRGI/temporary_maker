import { IsArray, IsBoolean, IsNumber } from "class-validator";

export class PartnerRulesRequestDto {
  @IsNumber()
  public daysSendingForNewPartners: number;

  @IsBoolean()
  public useNewPartnerForClickableCopies: boolean;

  @IsArray()
  public allowedIspsForNewPartners: string[];
}
