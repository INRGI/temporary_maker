import {
  BroadcastDomain,
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from '@epc-services/interface-adapters';
import { BroadcastRulesProps } from '../../../rules/domain/types/broadcast-rules.types';

export interface VerifyWarmupCopyForDomainPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastDomain: BroadcastDomain;
  copyName: string;
  sendingDate: string;
  priorityCopiesData: string[];
  broadcastRules: BroadcastRulesProps;
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
