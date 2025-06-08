import { Controller, Get, Param } from "@nestjs/common";
import {
  GetDomainsByTeamResponseDto,
} from "@epc-services/interface-adapters";
import { GetDomainsByTeamService } from "../services/get-domains-by-team/get-domains-by-team.service";

@Controller("organic/broadcast")
export class BroadcastMessageController {
  constructor(
    private readonly getDomainsByTeamService: GetDomainsByTeamService
  ) {}

  @Get(":team")
  public async getDomainsByTeam(
    @Param("team") team: string
  ): Promise<GetDomainsByTeamResponseDto> {
    const result = await this.getDomainsByTeamService.getDomains({ team });
    return result;
  }
}
