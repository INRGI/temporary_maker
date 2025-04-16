import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { ChangeFontSizePayload } from './change-font-size.payload';

@Injectable()
export class ChangeFontSizeService {
  public async modifyFontSize(payload: ChangeFontSizePayload): Promise<string> {
    const { html, fontSize } = payload;
    const dom = new JSDOM(`<div id="container">${html}</div>`);
    const { document } = dom.window;
    const container = document.getElementById('container');
    
    const updateStyles = (element: Element) => {
      const computedStyle = dom.window.getComputedStyle(element);
      const currentFontSize = parseFloat(computedStyle.fontSize);
      
      if (currentFontSize > 12) {
        const style = element.getAttribute('style') || '';
        const updatedStyle = style
          .replace(/font-size\s*:\s*[^;]+;?/gi, '')
          .trim();
        
        element.setAttribute(
          'style',
          updatedStyle
            ? `${updatedStyle}; font-size: ${fontSize};`
            : `font-size: ${fontSize};`
        );
      }
    };
    
    ['table', 'td', 'p', 'a', 'span', 'div'].forEach((tag) => {
      const elements = container?.getElementsByTagName(tag) || [];
      for (const element of elements) {
        updateStyles(element);
        const style = element.getAttribute('style');
        if (style) {
          element.setAttribute('style', style.replace(';;', ';'));
        }
      }
    });
    
    return container?.innerHTML || '';
  }
}