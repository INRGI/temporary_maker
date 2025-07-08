import {
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";

export interface GetPossibleReplacementCopiesPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastRules: BroadcastRulesProps;
  dateRange: string[];
  clickableCopies: string[];
  convertibleCopies: string[];
  warmupCopies: string[];
  testCopies: string[];
  priorityCopiesData: string[];
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
