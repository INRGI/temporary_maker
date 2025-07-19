import { Injectable } from "@nestjs/common";
import { MakeCopyService } from "../make-copy/make-copy.service";
import { GetDomainBroadcastWithDateService } from "../../../broadcast/services/get-domain-broadcast-with-date/get-domain-broadcast-with-date.service";
import { MakeMultipleCopiesPayload } from "./make-multiple-copies.payload";
import { GetMondayDataService } from "../get-monday-data/get-monday-data.service";
import { GetCryptoDataService } from "../get-crypto-data/get-crypto-data.service";

@Injectable()
export class MakeMultipleCopiesService {
  constructor(
    private readonly makeCopyService: MakeCopyService,
    private readonly getDomainBroadcastWithDateService: GetDomainBroadcastWithDateService,
    private readonly getMondayDataService: GetMondayDataService,
    private readonly getCryptoDataService: GetCryptoDataService
  ) {}

  public async makeMultipleCopies(
    payload: MakeMultipleCopiesPayload
  ): Promise<string | any> {
    const { preset, fromDate, toDate } = payload;

    const presetProps = preset;

    const domainBroadcast =
      await this.getDomainBroadcastWithDateService.getDomainBroadcastWithDate({
        team: presetProps.broadcast.team,
        domain: presetProps.broadcast.domain,
        fromDate,
        toDate,
      });

    if (presetProps.copyWhatToReplace?.isLinkUrl) {
      const cleanCopyNames = [];

      for (const item of domainBroadcast.broadcast) {
        for (const copy of item.copies) {
          if (copy.startsWith("+")) continue;
          if (copy.length < 3) continue;

          const nameMatch = copy.match(/^[a-zA-Z]+/);
          const product = nameMatch ? nameMatch[0] : "";

          if (!product) continue;
          cleanCopyNames.push(product);
        }
      }

      const mondayProductsData =
        await this.getMondayDataService.getAllRedtracksData(
          cleanCopyNames,
          preset.linkUrl.trackingType
        );

      const cryptoData = await this.getCryptoDataService.execute();

      const copies = [];

      for (const item of domainBroadcast.broadcast) {
        for (const copy of item.copies) {
          if (copy.startsWith("+")) continue;
          if (copy.length < 3) continue;
          const result = await this.makeCopyService.makeCopyWithData({
            copyName: copy,
            preset,
            sendingDate: item.date,
            mondayProductsData,
            cryptoData,
          });

          copies.push(result);
        }
      }

      return copies;
    } else {
      const copies = [];

      for (const item of domainBroadcast.broadcast) {
        for (const copy of item.copies) {
          if (copy.startsWith("+")) continue;
          if (copy.length < 3) continue;
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
}
