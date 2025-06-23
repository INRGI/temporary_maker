import { Controller, Get, UseInterceptors } from "@nestjs/common";
import {
  GetDomainStatusesResponseDto,
  GetProductStatusesResponseDto,
} from "@epc-services/interface-adapters";
import { GetDomainStatusesService } from "../services/get-domain-statuses/get-domain-statuses.service";
import { GetProductStatusesService } from "../services/get-product-statuses/get-product-statuses.service";
import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";

@Controller("finances/broadcast-tool/monday")
@UseInterceptors(CacheInterceptor)
export class MondayController {
  constructor(
    private readonly getDomainStatusesService: GetDomainStatusesService,
    private readonly getProductStatusesService: GetProductStatusesService
  ) {}

  @CacheKey("monday:product-statuses")
  @CacheTTL(900000)
  @Get("product-statuses")
  public async getProductStatuses(): Promise<GetProductStatusesResponseDto> {
    const result = await this.getProductStatusesService.execute();
    return result;
  }

  @CacheKey("monday:domain-statuses")
  @CacheTTL(900000)
  @Get("domain-statuses")
  public async getDomainStatuses(): Promise<GetDomainStatusesResponseDto> {
    const result = await this.getDomainStatusesService.execute();
    return result;
  }
}
