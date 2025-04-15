import { DefaultUnsubBlock } from '@epc-services/interface-adapters';

export interface BuildDefaultUnsubBlockPayload {
  defaultUnsubBlock: DefaultUnsubBlock;
  linkedText: string | null;
  unsubscribeUrl: string | null;
  unsubscribeText: string | null;
}
