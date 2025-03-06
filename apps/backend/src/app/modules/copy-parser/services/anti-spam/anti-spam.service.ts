import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import spamWords from './spam-words.json';
import { AntiSpamPayload } from './anti-spam.payload';

@Injectable()
export class AntiSpamService {
  private readonly replacements: Record<string, string> = {
    A: 'А',
    E: 'Е',
    I: 'І',
    O: 'О',
    P: 'Р',
    T: 'Т',
    H: 'Н',
    K: 'К',
    X: 'Х',
    C: 'С',
    B: 'В',
    M: 'М',
    e: 'е',
    y: 'у',
    i: 'і',
    o: 'о',
    a: 'а',
    x: 'х',
    c: 'с',
    '%': '％',
    $: 'ֆ',
  };

  private readonly spamWords: string[] = spamWords.spamWords;

  public async changeAllWords(payload: AntiSpamPayload): Promise<string> {
    const { html } = payload;
    const dom = new JSDOM(`<div id="root">${html}</div>`);
    const { document } = dom.window;
    const root = document.getElementById('root');

    this.processNode(root);

    return root?.innerHTML || '';
  }

  public async changeSpamWords(payload: AntiSpamPayload): Promise<string> {
    const { html } = payload;
    const dom = new JSDOM(`<div id="root">${html}</div>`);
    const { document } = dom.window;
    const root = document.getElementById('root');

    this.processNodeWords(root, this.spamWords);

    return root?.innerHTML || '';
  }

  private processNode(node: Node): void {
    if (node.nodeType === node.TEXT_NODE) {
      const text = node.textContent || '';
      node.textContent = this.replaceCharacters(text);
    } else {
      const children = Array.from(node.childNodes);
      children.forEach((child) => this.processNode(child));
    }
  }

  private processNodeWords(node: Node, spamWords: string[]): void {
    if (node.nodeType === node.TEXT_NODE) {
      const text = node.textContent || '';
      node.textContent = this.replaceSpamWords(text, spamWords);
    } else {
      const children = Array.from(node.childNodes);
      children.forEach((child) => this.processNodeWords(child, spamWords));
    }
  }

  private replaceSpamWords(text: string, spamWords: string[]): string {
    let result = text;

    spamWords.forEach((spamWord) => {
      const escapedSpamWord = this.escapeRegExp(spamWord);
      const regex = new RegExp(escapedSpamWord, 'gi');
      result = result.replace(regex, (match) => this.replaceCharacters(match));
    });

    return result;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  private replaceCharacters(text: string): string {
    let result = '';
    let entity = '';
    let isEntity = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '&') {
        isEntity = true;
        entity = char;
        continue;
      }

      if (isEntity) {
        entity += char;
        if (char === ';') {
          isEntity = false;
          result += entity;
          entity = '';
        }
        continue;
      }

      result += this.replacements[char] || char;
    }

    if (entity) {
      result += entity;
    }

    return result;
  }
}
