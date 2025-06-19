import { Provider } from '@nestjs/common';
import { GetBroadcastRulesByIdQueryService } from './queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service';
import { UpdateBroadcastRulesService } from './commands/update-broadcast-rules/update-broadcast-rules.service';
import { BroadcastRulesMessageController } from './controllers/broadcast-rules.message.controller';
import { DeleteBroadcastRulesService } from './commands/delete-broadcast-rules/delete-broadcast-rules.service';
import { CreateBroadcastRulesService } from './commands/create-broadcast-rules/create-broadcast-rules.service';
import { CheckCopyLastSendService } from './services/check-copy-last-send/check-copy-last-send.service';
import { CheckIfCopyCanBeTestedService } from './services/check-if-copy-can-be-tested/check-if-copy-can-be-tested.service';
import { CheckIfProductCanBeSendService } from './services/check-if-product-can-be-send/check-if-product-can-be-send.service';
import { CheckProductLastSendService } from './services/check-product-last-send/check-product-last-send.service';
import { GetPaginatedBroadcastRulesQueryService } from './queries/get-paginated-broadcast-rules/get-paginated-broadcast-rules.query-service';
import { CheckIfCopyCanBeSendService } from './services/check-if-copy-can-be-send/check-if-copy-can-be-send.service';
import { CheckIfDomainActiveService } from './services/check-if-domain-active/check-if-domain-active.service';
import { CheckIfCopyBlacklistedService } from './services/check-if-copy-blacklisted/check-if-copy-blacklisted.service';

export const messageControllers = [BroadcastRulesMessageController];

export const queryProviders: Provider[] = [
  GetBroadcastRulesByIdQueryService,
  GetPaginatedBroadcastRulesQueryService,
];

export const serviceProviders: Provider[] = [
  UpdateBroadcastRulesService,
  DeleteBroadcastRulesService,
  CreateBroadcastRulesService,
  CheckCopyLastSendService,
  CheckIfCopyCanBeTestedService,
  CheckIfProductCanBeSendService,
  CheckProductLastSendService,
  CheckIfCopyCanBeSendService,
  CheckIfDomainActiveService,
  CheckIfCopyBlacklistedService,
];
