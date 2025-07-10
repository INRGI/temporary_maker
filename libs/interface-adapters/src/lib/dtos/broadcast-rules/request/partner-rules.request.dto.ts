import { IsArray, IsNumber } from "class-validator";

export class PartnerRulesRequestDto {
  @IsArray()
  public blacklistedPartners: string[];

  @IsNumber()
  public similarPartnerDomainLimit: number;
}
