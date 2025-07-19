import { CryptoPartnerMapping, Preset } from "@epc-services/interface-adapters";

export interface MakeCopyPayload {
  copyName: string;
  preset: Preset;
  sendingDate: Date;
  mondayProductsData?: {
    product: string;
    trackingData: string;
    imgData: string;
    isForValidation?: boolean
  }[];
  cryptoData?: { product: string; mappings: CryptoPartnerMapping[] }[];
}
