import {
  GetMondayTrackingsResponseDto,
  MakeCopyRequestDto,
  MakeCopyResponseDto,
  MakeMulitpleCopiesRequestDto,
  MakeMultipleCopiesResponseDto,
} from '@epc-services/interface-adapters';
import { Body, Controller, Post } from '@nestjs/common';
import { MakeCopyService } from '../services/make-copy/make-copy.service';
import { MakeMultipleCopiesService } from '../services/make-multiple-copies/make-multiple-copies.service';
import { GetMondayTrackingsService } from '../services/get-monday-trackings/get-monday-trackings.service';


@Controller()
export class CopyMessageController {
  constructor(
    private readonly makeCopyService: MakeCopyService,
    private readonly makeMultipleCopiesService: MakeMultipleCopiesService,
    private readonly getTrackingsService: GetMondayTrackingsService
  ) {}


  public async makeCopy(
    request: MakeCopyRequestDto
  ): Promise<MakeCopyResponseDto> {
    const result = await this.makeCopyService.makeCopy(request);
    return result;
  }

  @Post('make-multiple-copies')
  public async makeMultipleCopies(
    @Body() request: MakeMulitpleCopiesRequestDto
  ): Promise<MakeMultipleCopiesResponseDto> {
    const today = new Date();
    // today.setDate(today.getDate() - 1);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 2);

    const result = await this.makeMultipleCopiesService.makeMultipleCopies({
      ...request,
      fromDate: today,
      toDate: threeDaysFromNow,
    });
    return result;
  }

  
  public async getTrackings(): Promise<GetMondayTrackingsResponseDto> {
    const result = await this.getTrackingsService.geTrackings();
    return result;
  }
}
