import {
  BroadcastDomain,
  CopyMinLimitPerDay,
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { BroadcastRulesProps } from "../../../rules/domain/types/broadcast-rules.types";

export interface BroadcastAssignerPayload {
  domain: BroadcastDomain;
  broadcast: GetAllDomainsResponseDto;
  broadcastRules: BroadcastRulesProps;
  date: string;
  clickableCopies: string[];
  convertibleCopies: string[];
  warmupCopies: string[];
  testCopies: string[];
  priorityCopiesData: string[];
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
  copiesWithoutQueue: CopyMinLimitPerDay[];
}
