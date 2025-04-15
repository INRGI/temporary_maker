import { HealthUnsubLinkUrl } from "@epc-services/interface-adapters";

export interface GetPriorityPayload {
  product: string;
  unsubLinkUrl: HealthUnsubLinkUrl
}
