import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { ChangeLineHeightPayload } from './change-line-height.payload';

@Injectable()
export class ChangeLineHeightService {
  public async modifyLineHeight(
    payload: ChangeLineHeightPayload
  ): Promise<string> {
    const { html, lineHeight } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');
    const updateStyles = (element: Element) => {
      const style = element.getAttribute('style');
      if (style) {
        const updatedStyle = style
          .replace(/line-height\s*:\s*[^;]+;?/gi, '')
          .trim();
        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; line-height: ${lineHeight};`
            : `line-height: ${lineHeight};`
        );
      } else {
        element.setAttribute('style', `line-height: ${lineHeight};`);
      }
    };
    ['table', 'td', 'p', 'a', 'span'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        updateStyles(element);
        element.setAttribute('style', element.getAttribute('style').replace(';;', ';'));
      }
    });
    return container?.innerHTML || '';
  }
}
