import { IsPadding, Padding } from '@epc-services/interface-adapters';

export interface ChangePaddingPayload {
  html: string;
  padding: Padding;
  isPadding: IsPadding;
}
