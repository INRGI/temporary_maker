import { Injectable } from '@nestjs/common';
import { ChangeMaxWidthPayload } from './change-max-width.payload';
import { JSDOM } from 'jsdom';

@Injectable()
export class ChangeMaxWidthService {
  public async modifyMaxWidth(payload: ChangeMaxWidthPayload): Promise<string> {
    const { html, maxWidth } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');
    const updateStyles = (element: Element) => {
      const style = element.getAttribute('style');
      if (style) {
        const updatedStyle = style
          .replace(/max-width\s*:\s*[^;]+;?/gi, '')
          .trim();
        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; max-width: ${maxWidth}px;`
            : `max-width: ${maxWidth}px;`
        );
      } else {
        element.setAttribute('style', `max-width: ${maxWidth}px;`);
      }
    };
    ['table', 'td', 'tbody'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        // if (element.hasAttribute('width')) {
        //   element.removeAttribute('width');
        // }
        if (element.hasAttribute('max-width')) {
          element.removeAttribute('max-width');
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
