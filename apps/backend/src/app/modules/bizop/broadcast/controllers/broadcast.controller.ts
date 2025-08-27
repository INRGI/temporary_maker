import { Controller, Get } from "@nestjs/common";
import { GetDomainsService } from "../services/get-domains/get-domains.service";
import { GetDomainsByTeamResponseDto } from "@epc-services/interface-adapters";

@Controller("bizop/broadcast")
export class BroadcastMessageController {
  constructor(private readonly getDomainsService: GetDomainsService) {}

  @Get("domains")
  public async getDomains(): Promise<GetDomainsByTeamResponseDto> {
    const result = await this.getDomainsService.getDomains();
    return result;
  }
}
