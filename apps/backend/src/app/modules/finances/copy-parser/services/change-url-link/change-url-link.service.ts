/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { ChangeUrlLinkPayload } from './change-url-link.payload';

@Injectable()
export class ChangeUrlLinkService {
  public async changeUrlLink(payload: ChangeUrlLinkPayload): Promise<string> {
    let { html, url } = payload;

    html = html.replace(/urlhere/g, url);
    html = html.replace(/insertlink/g, url);
    return html;
  }
}
