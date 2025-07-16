import {
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";
import { AdminBroadcastConfigProps } from "../../../rules/domain/types/admin-broadcast-config.types";

export interface GetUnavailableBroadcastCopiesPayload {
  broadcast: GetAllDomainsResponseDto;
  dateRange: string[];
  broadcastRules: BroadcastRulesProps;
  adminBroadcastConfig: AdminBroadcastConfigProps;
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
