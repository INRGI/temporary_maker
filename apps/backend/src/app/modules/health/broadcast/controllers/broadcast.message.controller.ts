import { Controller, Get } from "@nestjs/common";
import { GetDomainsByTeamResponseDto } from "@epc-services/interface-adapters";
import { GetDomainsService } from "../services/get-domains/get-domains.service";

@Controller("health/broadcast")
export class BroadcastMessageController {
  constructor(private readonly getDomainsService: GetDomainsService) {}

  @Get()
  public async getDomains(): Promise<GetDomainsByTeamResponseDto> {
    const result = await this.getDomainsService.getDomains();
    return result;
  }
}
