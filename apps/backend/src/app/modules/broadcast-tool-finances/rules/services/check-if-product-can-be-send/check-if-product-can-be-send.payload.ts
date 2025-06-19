import {
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
  ProductRules,
} from '@epc-services/interface-adapters';

export interface CheckIfProductCanBeSendPayload {
  broadcast: GetAllDomainsResponseDto;
  copyName: string;
  sendingDate: string;
  productRules: ProductRules;
  domain: string;
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}
