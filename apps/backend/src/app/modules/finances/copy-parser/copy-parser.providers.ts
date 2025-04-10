import { Provider } from '@nestjs/common';
import { ChangeBgColorService } from './services/change-bg-color/change-bg-color.service';
import { ChangeFontFamilyService } from './services/change-font-family/change-font-family.service';
import { ChangeFontSizeService } from './services/change-font-size/change-font-size.service';
import { ChangeLineHeightService } from './services/change-line-height/change-line-height.service';
import { ChangeLinkColorService } from './services/change-link-color/change-link-color.service';
import { ChangeMaxWidthService } from './services/change-max-width/change-max-width.service';
import { ChangePaddingService } from './services/change-padding/change-padding.service';
import { ChangeUrlLinkService } from './services/change-url-link/change-url-link.service';
import { AntiSpamService } from './services/anti-spam/anti-spam.service';
import { GetImageLinksService } from './services/get-image-links/get-image-links.service';
import { AddBotTrapService } from './services/add-bot-trap/add-bot-trap.service';
import { HtmlFormatterService } from './services/html-formatter/html-formatter.service';

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  ChangeBgColorService,
  ChangeFontFamilyService,
  ChangeFontSizeService,
  ChangeLineHeightService,
  ChangeLinkColorService,
  ChangeMaxWidthService,
  ChangePaddingService,
  ChangeUrlLinkService,
  AntiSpamService,
  GetImageLinksService,
  AddBotTrapService,
  HtmlFormatterService
];
