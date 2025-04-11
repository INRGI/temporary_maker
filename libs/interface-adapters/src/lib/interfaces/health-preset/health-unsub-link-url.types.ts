import { HealthUnsubHtmlBlock } from "./health-unsub-html-block.types";

export interface HealthUnsubLinkUrl {
  linkStart: string;
  unsubType: string;
  sheetName: string;
  linkEnd: string;
  unsubHtmlBlock?: HealthUnsubHtmlBlock;
}
