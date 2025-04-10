import { Preset } from "@epc-services/interface-adapters";

export interface MakeMultipleCopiesPayload {
  preset: Preset;
  fromDate: Date;
  toDate?: Date;
}
