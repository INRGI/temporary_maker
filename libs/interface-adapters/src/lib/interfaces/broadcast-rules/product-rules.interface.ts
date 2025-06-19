import { CopyMinLimitPerDay } from './copy-min-limit-per-day.interface';
import { CopySendingLimitPerDay } from './copy-sending-limit-per-day.interface';
import { DomainSending } from './domain-sending.interface';
import { ProductAllowedSendingDays } from './product-allowed-sending-days.interface';
import { ProductSendingLimitPerDay } from './product-sending-limit-per-day.interface';

export interface ProductRules {
  allowedMondayStatuses: string[];
  minConversionForClickableCopy: number;
  allowSimilarCopies: boolean;
  blacklistedCopies: string[];
  domainSending: DomainSending[];
  productAllowedSendingDays: ProductAllowedSendingDays[];
  productsSendingLimitPerDay: ProductSendingLimitPerDay[];
  copySendingLimitPerDay: CopySendingLimitPerDay[];
  copyMinLimitPerDay: CopyMinLimitPerDay[];
}
