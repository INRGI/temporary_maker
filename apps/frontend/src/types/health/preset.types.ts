import { BotTrap } from "./bot-trap.types";
import { Broadcast } from "./broadcast.types";
import { CopyStyles } from "./copy-styles.types";
import { CopyWhatToReplace } from "./copy-what-to-replace.types";
import { LinkUrl } from "./link-url.types";
import { SubjectLine } from "./subject-line.types";
import { UnsubLinkUrl } from "./unsub-link-url.types";
import { UploadImage } from "./upload-image.types";

export interface Preset {
  name: string;
  copyStyles?: CopyStyles;
  copyWhatToReplace?: CopyWhatToReplace;
  unsubLinkUrl?: UnsubLinkUrl;
  linkUrl?: LinkUrl;
  broadcast: Broadcast;
  subjectLine?: SubjectLine;
  botTrap?: BotTrap;
  format?: "html" | "mjml";
  uploadImage?: UploadImage;
}
