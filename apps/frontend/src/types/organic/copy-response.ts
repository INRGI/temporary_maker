import { UnsubData } from "./unsubData.types";

export interface ResponseCopy {
  copyName: string;
  html: string;
  unsubData?: UnsubData;
  subjects?: string[];
  imageLinks?: string[];
  buildedLink: string;
  sendingDate: Date;
}
