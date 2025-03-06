import { Injectable } from '@nestjs/common';
import { ChangePaddingPayload } from './change-padding.payload';
import { JSDOM } from 'jsdom';

@Injectable()
export class ChangePaddingService {
  public async modifyPadding(payload: ChangePaddingPayload): Promise<string> {
    const { html, padding } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');

    const updateStyles = (element: Element) => {
      const style = element.getAttribute('style');
      if (style) {
        const updatedStyle = style
          .replace(/padding\s*:\s*[^;]+;?/gi, '')
          .replace(/padding-top\s*:\s*[^;]+;?/gi, '')
          .replace(/padding-right\s*:\s*[^;]+;?/gi, '')
          .replace(/padding-bottom\s*:\s*[^;]+;?/gi, '')
          .replace(/padding-left\s*:\s*[^;]+;?/gi, '')
          .trim();
        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; padding-top: ${padding.top}; padding-right: ${padding.right}; padding-bottom: ${padding.bottom}; padding-left: ${padding.left};`
            : `padding-top: ${padding.top}; padding-right: ${padding.right}; padding-bottom: ${padding.bottom}; padding-left: ${padding.left};`
        );
      } else {
        element.setAttribute(
          'style',
          `padding-top: ${padding.top}; padding-right: ${padding.right}; padding-bottom: ${padding.bottom}; padding-left: ${padding.left};`
        );
      }
    };

    ['table'].forEach((tag) => {
      const tables = container?.getElementsByTagName(tag) || [];
      for (const table of tables) {
        const rows = table.getElementsByTagName('tr');
        for (const row of rows) {
          const cells = row.getElementsByTagName('td');
          if (
            cells.length === 1 &&
            cells[0].getAttribute('height') &&
            !cells[0].innerHTML.trim()
          ) {
            row.remove();
          }
        }
      }
    });

    ['table', 'td', 'tbody'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        if (element.hasAttribute('style')) {
          const style = element.getAttribute('style');
          element.setAttribute(
            'style',
            style
              .replace(/padding\s*:\s*[^;]+;?/gi, '')
              .replace(/padding-top\s*:\s*[^;]+;?/gi, '')
              .replace(/padding-right\s*:\s*[^;]+;?/gi, '')
              .replace(/padding-bottom\s*:\s*[^;]+;?/gi, '')
              .replace(/padding-left\s*:\s*[^;]+;?/gi, '')
          );
        }
      }
    });

    const firstTable = container?.getElementsByTagName('table')[0];
    if (firstTable) {
      updateStyles(firstTable);
      firstTable.setAttribute(
        'style',
        firstTable.getAttribute('style').replace(';;', ';')
      );
    }
    return container?.innerHTML || '';
  }
}
