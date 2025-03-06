import { Provider } from '@nestjs/common';
import { PriorityProductsMessageController } from './controllers/priority-products.message.controller';
import { GetPriorityService } from './services/get-priority/get-priority.service';
import { GetPriorityTypesService } from './services/get-priority-types/get-priority-types.service';

export const messageControllers = [PriorityProductsMessageController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetPriorityService,
  GetPriorityTypesService,
];
