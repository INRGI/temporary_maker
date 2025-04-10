import { Provider } from '@nestjs/common';
import { PriorityProductsMessageController } from './controllers/priority-products.message.controller';
import { GetPriorityService } from './services/get-priority/get-priority.service';
import { GetPriorityTypesService } from './services/get-priority-types/get-priority-types.service';
import { BuildDefaultUnsubBlockService } from './services/build-default-unsub-block/build-default-unsub-block.service';
import { BuildCustomUnsubBlockService } from './services/build-custom-unsub-block/build-custom-unsub-block.service';

export const messageControllers = [PriorityProductsMessageController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetPriorityService,
  GetPriorityTypesService,
  BuildDefaultUnsubBlockService,
  BuildCustomUnsubBlockService,
];
