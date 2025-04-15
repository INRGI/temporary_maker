import { HealthLinkUrl } from '@epc-services/interface-adapters';

export interface BuildLinkPayload {
  product: string;
  productLift: string;
  linkUrl: HealthLinkUrl;
  productImage?: string;
}
