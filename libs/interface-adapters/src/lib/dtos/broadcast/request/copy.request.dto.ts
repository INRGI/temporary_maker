import { IsBoolean, IsString } from "class-validator";

export class BroadcastCopyRequestDto {
  @IsString()
  name: string;

  @IsBoolean()
  isPriority: boolean;
}
