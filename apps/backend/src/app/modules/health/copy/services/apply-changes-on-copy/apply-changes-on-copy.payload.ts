import { Preset } from "@epc-services/interface-adapters";

export interface ApplyChangesOnCopyPayload {
  html: string;
  presetProps: Preset;
  linkUrl?: string;
}
