import { Controller, Get, Param } from "@nestjs/common";
import { GetDomainsByTeamResponseDto } from "@epc-services/interface-adapters";
import { GetDomainsService } from "../services/get-domains/get-domains.service";
import { GetDomainBroadcastFromDriveService } from "../services/get-domain-broadcast-from-drive/get-domain-broadcast-from-drive.service";

@Controller("health/broadcast")
export class BroadcastMessageController {
  constructor(
    private readonly getDomainsService: GetDomainsService,
    private readonly getDomainBroadcastFromDriveService: GetDomainBroadcastFromDriveService
  ) {}

  @Get()
  public async getDomains(): Promise<GetDomainsByTeamResponseDto> {
    const result = await this.getDomainsService.getDomains();
    return result;
  }

  @Get(":domain")
  public async getDomainBroadcast(
    @Param("domain") domain: string
  ): Promise<any> {
    const result =
      await this.getDomainBroadcastFromDriveService.getDomainBroadcastFromDrive(
        {
          domain,
        }
      );
    return result;
  }
}
