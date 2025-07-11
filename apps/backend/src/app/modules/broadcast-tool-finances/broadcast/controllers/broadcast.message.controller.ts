import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApproveBroadcastRequestDto,
  ApproveBroadcastSheetResponseDto,
  GetAllDomainsResponseDto,
  GetBroadcastDomainsListResponseDto,
  GetBroadcastsListResponseDto,
  GetBroadcastsSendsResponseDto,
  MakeBroadcastRequestDto,
} from "@epc-services/interface-adapters";
import { GetBroadcastsListService } from "../services/get-broadcasts-list/get-broadcasts-list.service";
import { MakeBroadcastService } from "../services/make-broadcast/make-broadcast.service";
import { ApproveBroadcastService } from "../services/approve-broadcast/approve-broadcast.service";
import { GetBroadcastDomainsListService } from "../services/get-broadcast-domains-list/get-broadcast-domains-list.service";
import { GetBroadcastsSendsService } from "../services/get-broadcasts-sends/get-broadcasts-sends.service";

@Controller("finances/broadcast-tool/broadcast")
export class BroadcastController {
  constructor(
    private readonly getBroadcastsListService: GetBroadcastsListService,
    private readonly makeBroadcastService: MakeBroadcastService,
    private readonly approveBroadcastService: ApproveBroadcastService,
    private readonly getBroadcastDomainsListService: GetBroadcastDomainsListService,
    private readonly getBroadcastsSendsService: GetBroadcastsSendsService
  ) {}

  @Get("domains/:spreadsheetId")
  public async getBroadcastDomainsList(
    @Param("spreadsheetId") spreadsheetId: string
  ): Promise<GetBroadcastDomainsListResponseDto> {
    return await this.getBroadcastDomainsListService.execute({
      spreadsheetId,
    });
  }

  @Get("broadcasts-list")
  public async getBroadcastsList(): Promise<GetBroadcastsListResponseDto> {
    return await this.getBroadcastsListService.execute();
  }

  @Post("make-broadcast")
  public async makeBroadcast(
    @Body() body: MakeBroadcastRequestDto
  ): Promise<GetAllDomainsResponseDto> {
    return await this.makeBroadcastService.execute(body);
  }

  @Post("approve-broadcast")
  public async approveBroadcast(
    @Body() body: ApproveBroadcastRequestDto
  ): Promise<ApproveBroadcastSheetResponseDto[]> {
    return await this.approveBroadcastService.execute(body);
  }

  @Get("broadcasts-sends")
  public async getBroadcastsSends(): Promise<GetBroadcastsSendsResponseDto> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 2);

    const toDate = new Date();
    return await this.getBroadcastsSendsService.execute({
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
    });
  }
}
