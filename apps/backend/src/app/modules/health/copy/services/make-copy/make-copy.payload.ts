import { HealthPreset } from "@epc-services/interface-adapters";

export interface MakeCopyPayload {
  copyName: string;
  preset: HealthPreset;
  sendingDate: Date;
  mondayProductsData?: {
    product: string;
    trackingData: string;
  }[];
}
