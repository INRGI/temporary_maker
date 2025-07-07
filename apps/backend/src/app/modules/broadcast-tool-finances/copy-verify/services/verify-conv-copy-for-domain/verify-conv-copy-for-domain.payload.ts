import {
  BroadcastDomain,
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from '@epc-services/interface-adapters';
import { BroadcastRulesProps } from '../../../rules/domain/types/broadcast-rules.types';

export interface VerifyConvCopyForDomainPayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastDomain: BroadcastDomain;
  sheetName: string;
  copyName: string;
  sendingDate: string;
  priorityCopiesData: string[];
  broadcastRules: BroadcastRulesProps;
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
