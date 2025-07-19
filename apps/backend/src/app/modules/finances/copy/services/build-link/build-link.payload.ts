import { CryptoPartnerMapping, LinkUrl } from '@epc-services/interface-adapters';

export interface BuildLinkPayload {
  product: string;
  productLift: string;
  linkUrl: LinkUrl;
  productImage?: string;
  trackingData?:{trackingData: string; imgData: string, isForValidation?: boolean};
  mondayProductsData?: {
    product: string;
    trackingData: string;
    imgData: string;
    isForValidation?: boolean
  }[];
  cryptoData?: { product: string; mappings: CryptoPartnerMapping[] }[];
}
