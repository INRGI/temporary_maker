import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { ChangeFontFamilyPayload } from './change-font-family.payload';

@Injectable()
export class ChangeFontFamilyService {
  public async modifyFontFamily(
    payload: ChangeFontFamilyPayload
  ): Promise<string> {
    const { html, fontFamily } = payload;

    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');

    const updateStyles = (element: Element) => {
      const style = element.getAttribute('style');
      if (style) {
        const updatedStyle = style
          .replace(/font-family\s*:\s*[^;]+;?/gi, '')
          .trim();
        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; font-family: '${fontFamily}', Arial, Helvetica, sans-serif;`
            : `font-family: '${fontFamily}', Arial, Helvetica, sans-serif;`
        );
      } else {
        element.setAttribute('style', `font-family: '${fontFamily}', Arial, Helvetica, sans-serif;`);
      }
    };

    ['table', 'td', 'p', 'a', 'span', 'div'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        updateStyles(element);
        element.setAttribute('style', element.getAttribute('style').replace(';;', ';'));
      }
    });

    return container?.innerHTML || '';
  }
}
