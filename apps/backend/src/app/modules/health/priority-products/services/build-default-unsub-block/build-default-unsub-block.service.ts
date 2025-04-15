import { Injectable } from '@nestjs/common';
import {
  CustomUnsubBlock,
  DefaultUnsubBlock,
} from '@epc-services/interface-adapters';
import { BuildDefaultUnsubBlockPayload } from './build-default-unsub-block.payload';

@Injectable()
export class BuildDefaultUnsubBlockService {
  public async buildDefaultUnsubBlock(
    payload: BuildDefaultUnsubBlockPayload
  ): Promise<string> {
    const { defaultUnsubBlock, unsubscribeText, linkedText, unsubscribeUrl } =
      payload;

    const htmlBlock = this.getDefaultHtmlBlock(defaultUnsubBlock);

    if (unsubscribeText && linkedText && unsubscribeUrl) {
      const linkStartWithLink = htmlBlock.linkStart.replace(
        'urlhere',
        unsubscribeUrl
      );
      const textWithLink = unsubscribeText.replace(
        linkedText,
        `${linkStartWithLink}${linkedText}${htmlBlock.linkEnd}`
      );
      return `${htmlBlock.htmlStart}${textWithLink}${htmlBlock.htmlEnd}`;
    }

    if (unsubscribeText) {
      return `${htmlBlock.htmlStart}${unsubscribeText}${htmlBlock.htmlEnd}`;
    }
    return '';
  }

  private getDefaultHtmlBlock(
    defaultUnsubBlock: DefaultUnsubBlock
  ): CustomUnsubBlock {
    const { padding, fontSize, textColor, linkColor, fontFamily, fontWeight, textAlign } =
      defaultUnsubBlock;
    const { top, right, bottom, left } = padding;

    const linkStart = `<a href="urlhere" style="font-weight: bold; text-decoration: underline; color: ${linkColor}; font-size: ${fontSize}; font-family: ${fontFamily};">`;
    const linkEnd = `</a>`;
    const htmlStart = `<table role="presentation" cellpadding="0" cellspacing="0" align="center">
      <tr>
          <td align="center" style="text-align: ${textAlign || 'center'}; padding: ${top}px ${right}px ${bottom}px ${left}px;">
          <p style="color: ${textColor}; font-weight: ${fontWeight || '400'}; font-size: ${fontSize}; font-family: ${fontFamily}; margin: 0; padding: 0;">`;
    const htmlEnd = `</p></td></tr></table>`;

    return {
      linkStart,
      linkEnd,
      htmlStart,
      htmlEnd,
    };
  }
}
