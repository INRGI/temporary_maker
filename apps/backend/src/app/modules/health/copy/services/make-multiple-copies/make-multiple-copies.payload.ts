import { HealthPreset } from "@epc-services/interface-adapters";

export interface MakeMultipleCopiesPayload {
  preset: HealthPreset;
  fromDate: Date;
  toDate?: Date;
}
