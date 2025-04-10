import { Controller, Get } from '@nestjs/common';
import { GetPriorityTypesResponseDto } from '@epc-services/interface-adapters';
import { GetPriorityService } from '../services/get-priority/get-priority.service';
import { GetPriorityTypesService } from '../services/get-priority-types/get-priority-types.service';

@Controller('finances/priority-products')
export class PriorityProductsMessageController {
  constructor(
    private readonly getPriorityService: GetPriorityService,
    private readonly getPriorityTypesService: GetPriorityTypesService
  ) {}

  public async getPriority(request: any): Promise<any> {
    const result = await this.getPriorityService.getPriorityDetails(request);
    return result;
  }

  @Get('types')
  public async getPriorityTypes(): Promise<GetPriorityTypesResponseDto> {
    const result = await this.getPriorityTypesService.getPriorityTypes();
    return result;
  }
}
