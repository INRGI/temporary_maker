import { Injectable } from '@nestjs/common';
import { BuildCustomUnsubBlockPayload } from './build-custom-unsub-block.payload';


@Injectable()
export class BuildCustomUnsubBlockService {
  public async buildCustomUnsubBlock(
    payload: BuildCustomUnsubBlockPayload
  ): Promise<string> {
    const { customUnsubBlock, unsubscribeText, linkedText, unsubscribeUrl } = payload;

    if (
      unsubscribeText &&
      linkedText &&
      unsubscribeUrl
    ) {
      const linkStartWithLink = customUnsubBlock.linkStart.replace(
        'insertlink',
        unsubscribeUrl
      );
      const textWithLink = unsubscribeText.replace(
        linkedText,
        `${linkStartWithLink}${linkedText}${customUnsubBlock.linkEnd}`
      );
      return `${customUnsubBlock.htmlStart}${textWithLink}${customUnsubBlock.htmlEnd}`;
    }

    if (unsubscribeText) {
      return `${customUnsubBlock.htmlStart}${unsubscribeText}${customUnsubBlock.htmlEnd}`;
    }

    return '';
  }
}
