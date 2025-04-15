import { IsString } from 'class-validator';
import { HealthPreset } from '../../../interfaces';

export class HealthMakeCopyRequestDto {
  @IsString()
  copyName: string;
  
  preset: HealthPreset;
}
