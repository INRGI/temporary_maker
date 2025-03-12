import { Injectable } from '@nestjs/common';
import { ChangePaddingPayload } from './change-padding.payload';
import { JSDOM } from 'jsdom';

@Injectable()
export class ChangePaddingService {
  public async modifyPadding(payload: ChangePaddingPayload): Promise<string> {
    const { html, padding, isPadding } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');

    const checkedPaddings = {
      top: isPadding.top ? padding.top : '20',
      bottom: isPadding.bottom ? padding.bottom : '20',
      right: isPadding.right ? padding.right : '20',
      left: isPadding.left ? padding.left: '20'
    }

    if (!isPadding.top && !isPadding.right && !isPadding.left && !isPadding.bottom) return html;

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
            ? `${updatedStyle}; padding-top: ${checkedPaddings.top}px; padding-right: ${checkedPaddings.right}px; padding-bottom: ${checkedPaddings.bottom}px; padding-left: ${checkedPaddings.left}px;`
            : `padding-top: ${checkedPaddings.top}px; padding-right: ${checkedPaddings.right}px; padding-bottom: ${checkedPaddings.bottom}px; padding-left: ${checkedPaddings.left}px;`
        );
      } else {
        element.setAttribute(
          'style',
          `padding-top: ${checkedPaddings.top}px; padding-right: ${checkedPaddings.right}px; padding-bottom: ${checkedPaddings.bottom}px; padding-left: ${checkedPaddings.left}px;`
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

    ['table'].forEach((tag) => {
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
