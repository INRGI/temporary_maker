import { BroadcastMessageController } from "./controllers/broadcast.controller";
import { GetDomainBroadcastFromDriveService } from "./services/get-domain-broadcast-from-drive/get-domain-broadcast-from-drive.service";
import { GetDomainBroadcastWithDateService } from "./services/get-domain-broadcast-with-date/get-domain-broadcast-with-date.service";
import { GetDomainsByTeamService } from "./services/get-domains-by-team/get-domains-by-team.service";

export const messageControllers = [BroadcastMessageController];

export const applicationProviders = [];

export const serviceProviders = [
  GetDomainBroadcastFromDriveService,
  GetDomainBroadcastWithDateService,
  GetDomainsByTeamService,
];
