import { Injectable } from "@nestjs/common";
import { GetUnavailableBroadcastCopiesPayload } from "./get-unavailable-broadcast-copies.payload";
import { ReverifyCopyService } from "../../../copy-verify/services/reverify-copy/reverify-copy.service";

@Injectable()
export class GetUnavailableBroadcastCopiesService {
  constructor(private readonly reverifyCopyService: ReverifyCopyService) {}
  public async execute(
    payload: GetUnavailableBroadcastCopiesPayload
  ): Promise<string[]> {
    try {
      const {
        dateRange,
        broadcast,
        broadcastRules,
        adminBroadcastConfig,
        domainsData,
        productsData,
      } = payload;

      const unavailableCopies: string[] = [];

      for (const date of dateRange) {
        const allDomains = broadcast.sheets.flatMap(
          (sheet) => sheet.domains ?? []
        );

        for (const domain of allDomains) {
          const copyNames = domain.broadcastCopies.flatMap((c) =>
            c.copies.map((c) => c.name)
          );

          for (const copyName of copyNames) {
            const result = await this.reverifyCopyService.execute({
              broadcast,
              sheetName: broadcast.sheets.find((sheet) =>
                sheet.domains.includes(domain)
              )?.sheetName,
              broadcastDomain: domain,
              adminBroadcastConfig,
              copyName,
              broadcastRules,
              sendingDate: date,
              productsData,
              domainsData,
            });

            if (!result) {
              unavailableCopies.push(copyName);
            }
          }
        }
      }

      return unavailableCopies;
    } catch (error) {
      return [];
    }
  }
}
