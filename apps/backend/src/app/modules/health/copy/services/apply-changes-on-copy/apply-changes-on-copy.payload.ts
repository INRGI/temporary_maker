import { HealthPreset } from "@epc-services/interface-adapters";

export interface ApplyChangesOnCopyPayload {
  html: string;
  presetProps: HealthPreset;
  linkUrl?: string;
}
