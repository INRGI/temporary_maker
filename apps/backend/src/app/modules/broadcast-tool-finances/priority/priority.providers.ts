import { Provider } from "@nestjs/common";
import { CheckForPriorityService } from "./services/check-for-priority/check-for-priority.service";
import { CheckAllForPriorityService } from "./services/check-all-for-priority/check-all-for-priority.service";

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  CheckForPriorityService,
  CheckAllForPriorityService,
];
