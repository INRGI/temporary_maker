/* eslint-disable no-useless-escape */
import { Injectable } from "@nestjs/common";
import { JSDOM } from "jsdom";
import spamWords from "./spam-words.json";
import { AntiSpamPayload } from "./anti-spam.payload";

@Injectable()
export class AntiSpamService {
  private readonly replacements: Record<string, string> = {
    A: "Α",
    E: "Ε",
    I: "Ι",
    O: "Ο",
    P: "Ρ",
    T: "Τ",
    H: "Η",
    S: "Ѕ",
    K: "Κ",
    X: "Χ",
    C: "С",
    B: "Β",
    M: "Μ",
    W: "𝖶",
    u: "υ",
    c: "ϲ",
    x: "х",
    o: "ο",
    i: "і",
    e: "е",
    l: "ⅼ",
    s: "ѕ",
    b: "ᖯ",
    "%": "％",
    $: "＄",
  };

  private readonly spamWords: string[] = spamWords.spamWords;

  public async changeAllWords(payload: AntiSpamPayload): Promise<string> {
    const { html } = payload;
    const dom = new JSDOM(`<div id="root">${html}</div>`);
    const { document } = dom.window;
    const root = document.getElementById("root");

    this.processNode(root);

    return root?.innerHTML || "";
  }

  public async changeSpamWords(payload: AntiSpamPayload): Promise<string> {
    const { html } = payload;
    const dom = new JSDOM(`<div id="root">${html}</div>`);
    const { document } = dom.window;
    const root = document.getElementById("root");

    this.processNodeWords(root, this.spamWords);

    return root?.innerHTML || "";
  }

  private processNode(node: Node): void {
    if (node.nodeType === node.TEXT_NODE) {
      const text = node.textContent || "";
      node.textContent = this.replaceCharacters(text);
    } else {
      const children = Array.from(node.childNodes);
      children.forEach((child) => this.processNode(child));
    }
  }

  private processNodeWords(node: Node, spamWords: string[]): void {
    if (node.nodeType === node.TEXT_NODE) {
      const text = node.textContent || "";
      node.textContent = this.replaceSpamWords(text, spamWords);
    } else {
      if (node.nodeType === node.ELEMENT_NODE) {
        this.processElementAttributes(node as Element, spamWords);
      }

      const children = Array.from(node.childNodes);
      children.forEach((child) => this.processNodeWords(child, spamWords));
    }
  }

  private processElementAttributes(
    element: Element,
    spamWords: string[]
  ): void {
    if (element.hasAttribute("alt")) {
      const altValue = element.getAttribute("alt") || "";
      const replaced = this.replaceSpamWords(altValue, spamWords);
      element.setAttribute("alt", replaced);
    }
  }

  private replaceSpamWords(text: string, spamWords: string[]): string {
    let result = text;

    spamWords.forEach((spamWord) => {
      const escapedSpamWord = this.escapeRegExp(spamWord);
      const regex = new RegExp(escapedSpamWord, "gi");
      result = result.replace(regex, (match) => this.replaceCharacters(match));
    });

    return result;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  private replaceCharacters(text: string): string {
    let result = "";
    let entity = "";
    let isEntity = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === "&") {
        isEntity = true;
        entity = char;
        continue;
      }

      if (isEntity) {
        entity += char;
        if (char === ";") {
          isEntity = false;
          result += entity;
          entity = "";
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
