import { IsArray, IsNumber } from "class-validator";

export class StrategyRequestDto {
  @IsNumber()
  public copiesPerDay: number;

  @IsArray()
  public copiesTypes: Array<"click" | "conversion" | "test" | "warmup">;
}
