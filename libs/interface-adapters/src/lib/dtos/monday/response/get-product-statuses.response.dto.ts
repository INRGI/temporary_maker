import { IsArray } from "class-validator";

export class GetProductStatusesResponseDto {
  @IsArray()
  public productStatuses: string[];

  @IsArray()
  public domainSendings: string[];
}
