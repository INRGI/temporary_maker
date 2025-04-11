import { BroadcastMessageController } from './controllers/broadcast.message.controller';
import { GetDomainBroadcastFromDriveService } from './services/get-domain-broadcast-from-drive/get-domain-broadcast-from-drive.service';
import { GetDomainBroadcastWithDateService } from './services/get-domain-broadcast-with-date/get-domain-broadcast-with-date.service';
import { GetDomainsService } from './services/get-domains/get-domains.service';

export const messageControllers = [BroadcastMessageController];

export const applicationProviders = [];

export const serviceProviders = [
  GetDomainBroadcastFromDriveService,
  GetDomainBroadcastWithDateService,
  GetDomainsService
];
