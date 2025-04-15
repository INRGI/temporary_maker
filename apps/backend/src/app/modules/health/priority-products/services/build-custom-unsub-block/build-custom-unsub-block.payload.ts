import { CustomUnsubBlock } from '@epc-services/interface-adapters';

export interface BuildCustomUnsubBlockPayload {
  customUnsubBlock: CustomUnsubBlock;
  linkedText: string | null;
  unsubscribeUrl: string | null;
  unsubscribeText: string | null;
}
