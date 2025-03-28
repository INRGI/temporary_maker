import {
  GetMondayTrackingsResponseDto,
  MakeCopyRequestDto,
  MakeCopyResponseDto,
  MakeMulitpleCopiesRequestDto,
  MakeMultipleCopiesResponseDto,
} from "@epc-services/interface-adapters";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MakeCopyService } from "../services/make-copy/make-copy.service";
import { MakeMultipleCopiesService } from "../services/make-multiple-copies/make-multiple-copies.service";
import { GetMondayTrackingsService } from "../services/get-monday-trackings/get-monday-trackings.service";
import { GetAllCopiesForProductService } from "../services/get-all-copies-for-product/get-all-copies-for-product.service";

@Controller("copy")
export class CopyMessageController {
  constructor(
    private readonly makeCopyService: MakeCopyService,
    private readonly makeMultipleCopiesService: MakeMultipleCopiesService,
    private readonly getTrackingsService: GetMondayTrackingsService,
    private readonly getAllCopiesForProductService: GetAllCopiesForProductService
  ) {}

  public async makeCopy(
    request: MakeCopyRequestDto
  ): Promise<MakeCopyResponseDto> {
    const result = await this.makeCopyService.makeCopy(request);
    return result;
  }

  @Post("make-multiple-copies")
  public async makeMultipleCopies(
    @Body() request: MakeMulitpleCopiesRequestDto
  ): Promise<MakeMultipleCopiesResponseDto> {
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
}
