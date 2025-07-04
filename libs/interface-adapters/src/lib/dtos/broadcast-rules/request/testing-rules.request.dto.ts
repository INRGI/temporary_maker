import { IsNumber } from "class-validator";

export class TestingRulesRequestDto {
  @IsNumber()
  public maxTestCopiesForDomain: number;

  @IsNumber()
  public maxSendsToBeTestCopy: number;

  @IsNumber()
  public similarTestCopyLimitPerDay: number;
}
