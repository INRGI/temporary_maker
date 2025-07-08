import { Provider } from '@nestjs/common';
import { GetAllDomainsService } from './services/get-all-domains/get-all-domains.service';
import { BroadcastController } from './controllers/broadcast.message.controller';
import { GetBroadcastsListService } from './services/get-broadcasts-list/get-broadcasts-list.service';
import { UpdateCellByDateAndDomainService } from './services/update-cell-by-date-and-domain/update-cell-by-date-and-domain.service';
import { MakeBroadcastService } from './services/make-broadcast/make-broadcast.service';
import { GetClickableCopiesService } from './services/get-clickable-copies/get-clickable-copies.service';
import { GetConvertableCopiesService } from './services/get-convertable-copies/get-convertable-copies.service';
import { BroadcastAssignerService } from './services/broadcast-assigner/broadcast-assigner.service';
import { ApproveBroadcastSheetService } from './services/approve-broadcast-sheet/approve-broadcast-sheet.service';
import { ApproveBroadcastService } from './services/approve-broadcast/approve-broadcast.service';
import { GetWarmupCopiesService } from './services/get-warmup-copies/get-warmup-copies.service';
import { GetTestableCopiesService } from './services/get-testable-copies/get-testable-copies.service';
import { AddPriorityCopyIndicatorService } from './services/add-priority-copy-indicator/add-priority-copy-indicator.service';
import { GetBroadcastDomainsListService } from './services/get-broadcast-domains-list/get-broadcast-domains-list.service';
import { ForceCopiesToRandomDomainsService } from './services/force-copies-to-random-domains/force-copies-to-random-domains.service';
import { GetPossibleReplacementCopiesService } from './services/get-possible-replacement-copies/get-possible-replacement-copies.service';

export const messageControllers = [BroadcastController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetAllDomainsService,
  GetBroadcastDomainsListService,
  GetBroadcastsListService,
  UpdateCellByDateAndDomainService,
  MakeBroadcastService,
  GetClickableCopiesService,
  GetConvertableCopiesService,
  BroadcastAssignerService,
  ApproveBroadcastSheetService,
  ApproveBroadcastService,
  GetWarmupCopiesService,
  GetTestableCopiesService,
  AddPriorityCopyIndicatorService,
  ForceCopiesToRandomDomainsService,
  GetPossibleReplacementCopiesService,
];
