import { HealthLinkUrl } from '@epc-services/interface-adapters';

export interface BuildLinkPayload {
  product: string;
  productLift: string;
  linkUrl: HealthLinkUrl;
  productImage?: string;
  mondayProductsData?: {
    product: string;
    trackingData: string;
  }[];
}
