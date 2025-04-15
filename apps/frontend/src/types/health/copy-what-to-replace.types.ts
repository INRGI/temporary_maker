import { IsPadding } from './is-padding.types';

export interface CopyWhatToReplace {
  isFontSize: boolean;
  isFontFamily: boolean;
  isLinkColor: boolean;
  isMaxWidth: boolean;
  isLineHeight: boolean;
  isPadding: IsPadding;
  isUnsubLink: boolean;
  isBgColor: boolean;
  isLinkUrl: boolean;
  isAntiSpam: 'None' | 'Full Anti Spam' | 'Spam Words Only';
  isBotTrap: boolean;
}
