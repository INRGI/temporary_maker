import { Injectable } from "@nestjs/common";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { RedoBroadcaastPayload } from "./redo-broadcast.payload";

@Injectable()
export class RedoBroadcastService {
  public async execute(
    payload: RedoBroadcaastPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcastRuleId, fromDate, toDate } = payload;

    return
  }

  private getDateRange(from: string, to: string): string[] {
    const result: string[] = [];
    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      result.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}