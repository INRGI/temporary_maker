import { UnsubLinkUrl } from "@epc-services/interface-adapters";

export interface GetPriorityPayload {
  product: string;
  unsubLinkUrl: UnsubLinkUrl
}
