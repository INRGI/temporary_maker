import { BotTrap } from "./bot-trap.types";
import { Broadcast } from "./broadcast.types";
import { CopyStyles } from "./copy-styles.types";
import { CopyWhatToReplace } from "./copy-what-to-replace.types";
import { LinkUrl } from "./link-url.types";
import { SubjectLine } from "./subject-line.types";

export interface Preset {
  name: string;
  copyStyles?: CopyStyles;
  copyWhatToReplace?: CopyWhatToReplace;
  linkUrl?: LinkUrl;
  broadcast: Broadcast;
  subjectLine?: SubjectLine;
  botTrap?: BotTrap;
}
