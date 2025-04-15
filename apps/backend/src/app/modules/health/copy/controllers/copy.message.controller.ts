import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MakeMultipleCopiesService } from "../services/make-multiple-copies/make-multiple-copies.service";
import { GetMondayTrackingsService } from "../services/get-monday-trackings/get-monday-trackings.service";
import { GetAllCopiesForProductService } from "../services/get-all-copies-for-product/get-all-copies-for-product.service";
import { SpaceAdBuildLinkService } from "../services/space-ad-build-link/space-ad-build-link.service";
import { SpaceAdBuildLinkPayload } from "../services/space-ad-build-link/space-ad-build-link.payload";
import { HealthGetMondayTrackingsResponseDto, HealthMakeMulitpleCopiesRequestDto, HealthMakeMultipleCopiesResponseDto } from "@epc-services/interface-adapters";

@Controller("health/copy")
export class CopyMessageController {
  constructor(
    private readonly makeMultipleCopiesService: MakeMultipleCopiesService,
    private readonly getTrackingsService: GetMondayTrackingsService,
    private readonly getAllCopiesForProductService: GetAllCopiesForProductService,
    private readonly buildSpaceAdLinkService: SpaceAdBuildLinkService,
  ) {}

  @Post("make-multiple-copies")
  public async makeMultipleCopies(
    @Body() request: HealthMakeMulitpleCopiesRequestDto
  ): Promise<HealthMakeMultipleCopiesResponseDto> {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 2);

    const result = await this.makeMultipleCopiesService.makeMultipleCopies({
      ...request,
      fromDate: today,
      toDate: threeDaysFromNow,
    });
    return await result;
  }

  @Get("trackings")
  public async getTrackings(): Promise<HealthGetMondayTrackingsResponseDto> {
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
}
