import { IsArray, IsBoolean, IsNumber } from "class-validator";
import { DomainSendingRequestDto } from "./domain-sending.request.dto";
import { ProductAllowedSendingDaysRequestDto } from "./product-allowed-sending-days.request.dto";
import { ProductSendingLimitPerDayRequestDto } from "./product-sending-limit-per-day.request.dto";
import { CopySendingLimitPerDayRequestDto } from "./copy-sending-limit-per-day.request.dto";
import { CopyMinLimitPerDayRequestDto } from "./copy-min-limit-per-day.request.dto";

export class ProductRulesRequestDto {
  @IsArray()
  public allowedMondayStatuses: string[];

  @IsArray()
  public blacklistedCopies: string[];

  @IsArray()
  public domainSending: DomainSendingRequestDto[];

  @IsArray()
  public productAllowedSendingDays: ProductAllowedSendingDaysRequestDto[];

  @IsArray()
  public productsSendingLimitPerDay: ProductSendingLimitPerDayRequestDto[];

  @IsArray()
  public copySendingLimitPerDay: CopySendingLimitPerDayRequestDto[];

  @IsArray()
  public copyMinLimitPerDay: CopyMinLimitPerDayRequestDto[];

  @IsArray()
  public blacklistedSectors: string[];

  @IsNumber()
  public similarSectorDomainLimit: number;
}
