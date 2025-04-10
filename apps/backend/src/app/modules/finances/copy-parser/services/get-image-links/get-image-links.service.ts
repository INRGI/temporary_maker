import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { GetImageLinksPayload } from './get-image-links.payload';

@Injectable()
export class GetImageLinksService {
  public async getLinks(payload: GetImageLinksPayload): Promise<string[]> {
    const { html } = payload;
    const dom = new JSDOM(`<div id="root">${html}</div>`);
    const { document } = dom.window;
    const root = document.getElementById('root');
    const images = root?.getElementsByTagName('img') || [];
    const links: string[] = [];
    for (const image of images) {
      links.push(image.getAttribute('src') || '');
    }
    return links;
  }
}
