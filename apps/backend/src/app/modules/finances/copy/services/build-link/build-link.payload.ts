import { LinkUrl } from '@epc-services/interface-adapters';

export interface BuildLinkPayload {
  product: string;
  productLift: string;
  linkUrl: LinkUrl;
  productImage?: string;
}
