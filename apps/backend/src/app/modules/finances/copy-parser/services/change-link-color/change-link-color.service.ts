import { Injectable } from '@nestjs/common';
import { ChangeLinkColorPayload } from './change-link-color.payload';
import { JSDOM } from 'jsdom';

@Injectable()
export class ChangeLinkColorService {
  public async modifyLinkColor(
    payload: ChangeLinkColorPayload
  ): Promise<string> {
    const { html, linkColor } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');

    const updateStyles = (element: Element) => {
      const style = element.getAttribute('style');
      if (style) {
        const hasBackgroundColor = (style: string): boolean =>
          /background(-color)?\s*:\s*[^;]+/i.test(style);
        const bgColor = hasBackgroundColor(style) || element.hasAttribute('bgcolor') || element.hasAttribute('background');
        if (bgColor) {
          return;
        }
        const updatedStyle = style.replace(/color\s*:\s*[^;]+;?/gi, '').trim();
        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; color: ${linkColor};`
            : `color: ${linkColor};`
        );
      } else {
        element.setAttribute('style', `color: ${linkColor};`);
      }
    };
    ['a'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        const img = element.querySelector('img');
        if (img) {
          continue;
        }
        
        updateStyles(element);
        element.setAttribute(
          'style',
          element.getAttribute('style').replace(';;', ';')
        );
      }
    });

    return container?.innerHTML || '';
  }
}
