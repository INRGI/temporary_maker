import {
  GetMondayTrackingsResponseDto,
  MakeCopyRequestDto,
  MakeCopyResponseDto,
  MakeMulitpleCopiesRequestDto,
  MakeMultipleCopiesResponseDto,
} from "@epc-services/interface-adapters";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MakeMultipleCopiesService } from "../services/make-multiple-copies/make-multiple-copies.service";
import { GetMondayTrackingsService } from "../services/get-monday-trackings/get-monday-trackings.service";
import { GetAllCopiesForProductService } from "../services/get-all-copies-for-product/get-all-copies-for-product.service";
import { SpaceAdBuildLinkService } from "../services/space-ad-build-link/space-ad-build-link.service";
import { SpaceAdBuildLinkPayload } from "../services/space-ad-build-link/space-ad-build-link.payload";
import { MakeCopyService } from "../services/make-copy/make-copy.service";
import { AntiSpamService } from "../../copy-parser/services/anti-spam/anti-spam.service";

@Controller("finances/copy")
export class CopyMessageController {
  constructor(
    private readonly makeMultipleCopiesService: MakeMultipleCopiesService,
    private readonly getTrackingsService: GetMondayTrackingsService,
    private readonly getAllCopiesForProductService: GetAllCopiesForProductService,
    private readonly buildSpaceAdLinkService: SpaceAdBuildLinkService,
    private readonly makeCopyService: MakeCopyService,
    private readonly antiSpamService: AntiSpamService,
  ) {}

  @Post("make-multiple-copies")
  public async makeMultipleCopies(
    @Body() request: MakeMulitpleCopiesRequestDto
  ): Promise<MakeMultipleCopiesResponseDto> {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 2);

    const fromDate = request.fromDate || today;
    const toDate = request.toDate || request.fromDate || threeDaysFromNow;

    const result = await this.makeMultipleCopiesService.makeMultipleCopies({
      ...request,
      fromDate,
      toDate,
    });
    return await result;
  }

  @Post("make-copy")
  public async makeCopy(
    @Body() request: MakeCopyRequestDto
  ): Promise<MakeCopyResponseDto> {
    const today = new Date();
    today.setDate(today.getDate());

    const result = await this.makeCopyService.makeCopy({
      ...request,
      sendingDate: today,
    });
    return await result;
  }

  @Get("trackings")
  public async getTrackings(): Promise<GetMondayTrackingsResponseDto> {
    const result = await this.getTrackingsService.geTrackings();
    return await result;
  }

  @Get("all-copies/:product")
  public async get(
    @Param("product") product: string,
    @Query("minLift") minLift?: number,
    @Query("maxLift") maxLift?: number
  ) {
    const result = await this.getAllCopiesForProductService.getAllCopies({
      product,
      minLift,
      maxLift,
    });
    return result;
  }

  @Post("space-ad-build-link")
  public async buildLink(@Body() payload: SpaceAdBuildLinkPayload) {
    const result = await this.buildSpaceAdLinkService.buildLink(payload);

    return result;
  }

  @Post("anti-spam")
  public async antiSpam(@Body() payload: { html: string, antiSpamType: 'Full Anti Spam' | 'Spam Words Only'; }) {
    const{ html, antiSpamType } = payload;

    if (antiSpamType === 'Full Anti Spam') {
      return await this.antiSpamService.changeAllWords({ html });
    } else if (antiSpamType === 'Spam Words Only') {
      return await this.antiSpamService.changeSpamWords({ html });
    }
  }
}
