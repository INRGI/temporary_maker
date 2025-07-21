import { Injectable } from "@nestjs/common";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { RedoBroadcaastPayload } from "./redo-broadcast.payload";
import { getDateRange } from "../../utils/getDateRange";

@Injectable()
export class RedoBroadcastService {
  public async execute(
    payload: RedoBroadcaastPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcastRuleId, fromDate, toDate } = payload;

    const dateRange = getDateRange(fromDate, toDate);
    return;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
