import { Injectable } from "@nestjs/common";
import { MakeCopyService } from "../make-copy/make-copy.service";
import { GetDomainBroadcastWithDateService } from "../../../broadcast/services/get-domain-broadcast-with-date/get-domain-broadcast-with-date.service";
import { MakeMultipleCopiesPayload } from "./make-multiple-copies.payload";

@Injectable()
export class MakeMultipleCopiesService {
  constructor(
    private readonly makeCopyService: MakeCopyService,
    private readonly getDomainBroadcastWithDateService: GetDomainBroadcastWithDateService
  ) {}

  public async makeMultipleCopies(
    payload: MakeMultipleCopiesPayload
  ): Promise<string | any> {
    const { preset, fromDate, toDate } = payload;

    const presetProps = preset;

    const domainBroadcast =
      await this.getDomainBroadcastWithDateService.getDomainBroadcastWithDate({
        domain: presetProps.broadcast.domain,
        fromDate,
        toDate,
      });
      
    const copies = [];

    for (const item of domainBroadcast.broadcast) {
      for (const copy of item.copies) {
        if(copy.startsWith("+")) continue
        if(copy.length < 3) continue
        const result = await this.makeCopyService.makeCopy({
          copyName: copy,
          preset,
          sendingDate: item.date,
        });

        copies.push(result);
      }
    }

    return copies;
  }
}
