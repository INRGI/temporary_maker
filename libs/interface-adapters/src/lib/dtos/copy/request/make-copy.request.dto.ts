import { IsString, IsUUID } from 'class-validator';
import { Preset } from '../../../interfaces';

export class MakeCopyRequestDto {
  @IsString()
  copyName: string;
  
  preset: Preset;
}
