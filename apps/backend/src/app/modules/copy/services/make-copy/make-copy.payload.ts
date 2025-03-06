import { Preset } from "@epc-services/interface-adapters";

export interface MakeCopyPayload {
  copyName: string;
  preset: Preset;
}
