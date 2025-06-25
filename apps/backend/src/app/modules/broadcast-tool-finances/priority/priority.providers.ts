import { Provider } from "@nestjs/common";
import { CheckForPriorityService } from "./services/check-for-priority/check-for-priority.service";
import { CheckAllForPriorityService } from "./services/check-all-for-priority/check-all-for-priority.service";
import { GetAllPriorityProductsService } from "./services/get-all-priority-products/get-all-priority-products.service";

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  CheckForPriorityService,
  CheckAllForPriorityService,
  GetAllPriorityProductsService,
];
