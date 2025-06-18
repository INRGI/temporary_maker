import { Controller } from '@nestjs/common';
import { GetAllDataService } from '../services/get-all-data/get-all-data.service';
import { GetAllDataResponseDto } from '@epc-services/interface-adapters';

@Controller()
export class BigQueryController {
  constructor(private readonly getAllDataService: GetAllDataService) {}

  public async getAllData(): Promise<GetAllDataResponseDto> {
    return await this.getAllDataService.execute();
  }
}
