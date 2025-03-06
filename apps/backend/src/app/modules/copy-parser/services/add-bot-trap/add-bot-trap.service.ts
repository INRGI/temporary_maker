import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { AddBotTrapPayload } from './add-bot-trap.payload';

@Injectable()
export class AddBotTrapService {
  public async addBotTrap(payload: AddBotTrapPayload): Promise<string> {
    const { html, botTrap } = payload;

    const textContent = this.extractPlainText(html);

    const targetText = this.findTargetText(textContent, botTrap.type);

    if (!targetText) return html;

    return this.insertLinkIntoHTML(html, targetText, botTrap.url);
  }

  private extractPlainText(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private findTargetText(text: string, type: string): string | null {
    switch (type) {
      case 'first-spec-symbol':
        return this.findFirstSpecialSymbol(text);
      case 'last-spec-symbol':
        return this.findLastSpecialSymbol(text);
      case 'first-word-first-sentence':
        return this.findFirstWordFirstSentence(text);
      case 'last-word-first-sentence':
        return this.findLastWordFirstSentence(text);
      case 'first-word-last-sentence':
        return this.findFirstWordLastSentence(text);
      case 'last-word-last-sentence':
        return this.findLastWordLastSentence(text);
      default:
        return null;
    }
  }
  private insertLinkIntoHTML(
    html: string,
    targetText: string,
    url: string
  ): string {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const textElement = this.findElementContainingText(
      document.body,
      targetText
    );

    const textColor = textElement
      ? this.getInheritedTextColor(textElement)
      : '#000000';

    const linkTemplate = `<a href="${url}" style="text-decoration: none; color: ${textColor};">${targetText}</a>`;

    const regex = new RegExp(
      this.escapeRegExp(targetText) +
        '(?!.*' +
        this.escapeRegExp(targetText) +
        ')',
      'g'
    );
    return html.replace(regex, linkTemplate);
  }

  private findElementContainingText(node: any, text: string): Element | null {
    if (node.nodeType === 3 && node.textContent?.includes(text)) {
      return node.parentElement;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const childResult = this.findElementContainingText(
        node.childNodes[i],
        text
      );
      if (childResult) return childResult;
    }

    return null;
  }

  private getInheritedTextColor(element: Element): string {
    while (element) {
      const inlineStyle = element.getAttribute('style');
      if (inlineStyle) {
        const colorMatch = inlineStyle.match(/color:\s*([^;]+)/i);
        if (colorMatch) return colorMatch[1];
      }

      if (element.hasAttribute('color')) {
        return element.getAttribute('color') || '#000000';
      }

      element = element.parentElement || document.body;
    }

    return '#000000';
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private findFirstSpecialSymbol(text: string): string | null {
    const match = text.match(/[^\w\s]/);
    return match ? match[0] : null;
  }

  private findLastSpecialSymbol(text: string): string | null {
    const matches = text.match(/[^\w\s]/g);

    if (matches && matches.length > 0) {
      return matches[matches.length - 1];
    }

    return null;
  }

  private findFirstWordFirstSentence(text: string): string | null {
    const sentences = text.split(/[.!?]/);
    const firstSentence = sentences[0].trim();
    const words = firstSentence.match(/\b\w+\b/);
    return words ? words[0] : null;
  }

  private findLastWordFirstSentence(text: string): string | null {
    const sentences = text.split(/[.!?]/);
    const firstSentence = sentences[0].trim();
    const words = firstSentence.match(/\b\w+\b/g);
    return words ? words[words.length - 1] : null;
  }

  private findFirstWordLastSentence(text: string): string | null {
    const sentences = text.match(/[^.!?]+(?:[.!?]+|\s*$)/g);
    if (!sentences) return null;

    const lastSentence = sentences[sentences.length - 1].trim();
    const words = lastSentence.match(/\b\w+\b/);
    return words ? words[0] : null;
  }

  private findLastWordLastSentence(text: string): string | null {
    const sentences = text.match(/[^.!?]+(?:[.!?]+|\s*$)/g);
    if (!sentences) return null;

    const lastSentence = sentences[sentences.length - 1].trim();
    const words = lastSentence.match(/\b\w+\b/g);
    return words ? words[words.length - 1] : null;
  }
}
