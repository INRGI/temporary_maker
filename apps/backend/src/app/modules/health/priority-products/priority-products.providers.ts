import { Provider } from '@nestjs/common';
import { GetPriorityService } from './services/get-priority/get-priority.service';
import { BuildDefaultUnsubBlockService } from './services/build-default-unsub-block/build-default-unsub-block.service';
import { BuildCustomUnsubBlockService } from './services/build-custom-unsub-block/build-custom-unsub-block.service';

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetPriorityService,
  BuildDefaultUnsubBlockService,
  BuildCustomUnsubBlockService,
];
