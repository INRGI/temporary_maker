import { IsArray } from "class-validator";

export class DomainRulesRequestDto {
  @IsArray()
  public allowedMondayStatuses: string[];
}
