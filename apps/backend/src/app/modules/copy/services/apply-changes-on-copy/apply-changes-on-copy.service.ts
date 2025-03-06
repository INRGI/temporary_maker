import { Injectable } from '@nestjs/common';
import { ChangeBgColorService } from '../../../copy-parser/services/change-bg-color/change-bg-color.service';
import { ChangeFontFamilyService } from '../../../copy-parser/services/change-font-family/change-font-family.service';
import { ChangeFontSizeService } from '../../../copy-parser/services/change-font-size/change-font-size.service';
import { ChangeLineHeightService } from '../../../copy-parser/services/change-line-height/change-line-height.service';
import { ChangeLinkColorService } from '../../../copy-parser/services/change-link-color/change-link-color.service';
import { ChangeMaxWidthService } from '../../../copy-parser/services/change-max-width/change-max-width.service';
import { ChangePaddingService } from '../../../copy-parser/services/change-padding/change-padding.service';
import { ChangeUrlLinkService } from '../../../copy-parser/services/change-url-link/change-url-link.service';
import { AntiSpamService } from '../../../copy-parser/services/anti-spam/anti-spam.service';
import { AddBotTrapService } from '../../../copy-parser/services/add-bot-trap/add-bot-trap.service';
import { ApplyChangesOnCopyPayload } from './apply-changes-on-copy.payload';


@Injectable()
export class ApplyChangesOnCopyService {
  constructor(
    private readonly changeBgColorService: ChangeBgColorService,
    private readonly changeFontFamilyService: ChangeFontFamilyService,
    private readonly changeFontSizeService: ChangeFontSizeService,
    private readonly changeLineHeightService: ChangeLineHeightService,
    private readonly changeLinkColorService: ChangeLinkColorService,
    private readonly changeMaxWidthService: ChangeMaxWidthService,
    private readonly changePaddingService: ChangePaddingService,
    private readonly changeUrlLinkService: ChangeUrlLinkService,
    private readonly antiSpam: AntiSpamService,
    private readonly addBotTrapService: AddBotTrapService
  ) {}

  public async applyChangesOnCopy(
    payload: ApplyChangesOnCopyPayload
  ): Promise<string> {
    const { presetProps, linkUrl } = payload;
    let { html } = payload;

    if (
      presetProps.copyWhatToReplace.isBgColor &&
      presetProps.copyStyles.bgColor
    ) {
      html = await this.changeBgColorService.modifyBackgroundColors({
        html: html,
        bgColor: presetProps.copyStyles.bgColor,
      });
    }

    if (
      presetProps.copyWhatToReplace.isFontFamily &&
      presetProps.copyStyles.fontFamily
    ) {
      html = await this.changeFontFamilyService.modifyFontFamily({
        html: html,
        fontFamily: presetProps.copyStyles.fontFamily,
      });
    }

    if (
      presetProps.copyWhatToReplace.isFontSize &&
      presetProps.copyStyles.fontSize
    ) {
      html = await this.changeFontSizeService.modifyFontSize({
        html: html,
        fontSize: presetProps.copyStyles.fontSize,
      });
    }

    if (
      presetProps.copyWhatToReplace.isLineHeight &&
      presetProps.copyStyles.lineHeight
    ) {
      html = await this.changeLineHeightService.modifyLineHeight({
        html: html,
        lineHeight: presetProps.copyStyles.lineHeight,
      });
    }

    if (
      presetProps.copyWhatToReplace.isLinkColor &&
      presetProps.copyStyles.linkColor
    ) {
      html = await this.changeLinkColorService.modifyLinkColor({
        html: html,
        linkColor: presetProps.copyStyles.linkColor,
      });
    }

    if (
      presetProps.copyWhatToReplace.isMaxWidth &&
      presetProps.copyStyles.maxWidth
    ) {
      html = await this.changeMaxWidthService.modifyMaxWidth({
        html: html,
        maxWidth: presetProps.copyStyles.maxWidth,
      });
    }

    if (
      presetProps.copyWhatToReplace.isPadding &&
      presetProps.copyStyles.padding
    ) {
      html = await this.changePaddingService.modifyPadding({
        html: html,
        padding: presetProps.copyStyles.padding,
      });
    }

    if (
      presetProps.copyWhatToReplace.isLinkUrl &&
      presetProps.linkUrl &&
      linkUrl
    ) {
      html = await this.changeUrlLinkService.changeUrlLink({
        html: html,
        url: linkUrl,
      });
    }

    if (presetProps.copyWhatToReplace.isBotTrap && presetProps.botTrap) {
      html = await this.addBotTrapService.addBotTrap({
        html: html,
        botTrap: presetProps.botTrap,
      });
    }

    if (
      presetProps.copyWhatToReplace.isAntiSpam &&
      presetProps.copyWhatToReplace.isAntiSpam === 'Full Anti Spam'
    ) {
      html = await this.antiSpam.changeAllWords({
        html: html,
      });
    }

    if (
      presetProps.copyWhatToReplace.isAntiSpam &&
      presetProps.copyWhatToReplace.isAntiSpam === 'Spam Words Only'
    ) {
      html = await this.antiSpam.changeSpamWords({
        html: html,
      });
    }

    return html;
  }
}
