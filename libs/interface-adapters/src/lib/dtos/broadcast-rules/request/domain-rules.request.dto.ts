import { IsArray, IsNumber } from "class-validator";

export class DomainRulesRequestDto {
  @IsNumber()
  public minClicksToBeLive: number;

  @IsNumber()
  public avarageClicksDays: number;

  @IsArray()
  public allowedMondayStatuses: string[];
}
