import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { BgColorPayload } from './change-bg-color.payload';

@Injectable()
export class ChangeBgColorService {
  public async modifyBackgroundColors(payload: BgColorPayload): Promise<string> {
    const { html, bgColor } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');

    const updateStyles = (element: Element) => {
      const style = element.getAttribute('style');
      
      if (style) {
        const updatedStyle = style
          .replace(/background-color\s*:\s*[^;]+;?/gi, '')
          .trim();

        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; background-color: ${bgColor};`
            : `background-color: ${bgColor};`
        );
      } else {
        element.setAttribute('style', `background-color: ${bgColor};`);
      }
    };

    ['table', 'td'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        const isButtonWithLink = tag === 'td' && 
          element.querySelector('a[href]') && 
          element.querySelectorAll('*').length === 1;
        
        if (isButtonWithLink) {
          continue;
        }
        
        if (element.hasAttribute('bgcolor')) {
          element.removeAttribute('bgcolor');
        }
        updateStyles(element);
        element.setAttribute('style', element.getAttribute('style').replace(';;', ';'));
      }
    });

    return container?.innerHTML || '';
  }
}