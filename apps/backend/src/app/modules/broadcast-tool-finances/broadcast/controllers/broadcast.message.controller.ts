import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  ApproveBroadcastRequestDto,
  ApproveBroadcastSheetResponseDto,
  GetAllDomainsResponseDto,
  GetBroadcastsListResponseDto,
  MakeBroadcastRequestDto,
} from "@epc-services/interface-adapters";
import { GetBroadcastsListService } from "../services/get-broadcasts-list/get-broadcasts-list.service";
import { MakeBroadcastService } from "../services/make-broadcast/make-broadcast.service";
import { ApproveBroadcastService } from "../services/approve-broadcast/approve-broadcast.service";

@Controller("finances/broadcast-tool/broadcast")
export class BroadcastController {
  constructor(
    private readonly getBroadcastsListService: GetBroadcastsListService,
    private readonly makeBroadcastService: MakeBroadcastService,
    private readonly approveBroadcastService: ApproveBroadcastService
  ) {}

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
}
