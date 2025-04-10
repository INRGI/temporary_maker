import { Injectable } from "@nestjs/common";
import { JSDOM } from "jsdom";
import { AddBotTrapPayload } from "./add-bot-trap.payload";

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
    const dom = new JSDOM(html);
    return dom.window.document.body.textContent || "";
  }

  private findTargetText(text: string, type: string): string | null {
    switch (type) {
      case "first-spec-symbol":
        return this.findFirstSpecialSymbol(text);
      case "last-spec-symbol":
        return this.findLastSpecialSymbol(text);
      case "first-word-first-sentence":
        return this.findFirstWordFirstSentence(text);
      case "last-word-first-sentence":
        return this.findLastWordFirstSentence(text);
      case "first-word-last-sentence":
        return this.findFirstWordLastSentence(text);
      case "last-word-last-sentence":
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

    const textNodes = this.getTextNodesNotInLinks(document.body);

    let targetNode = null;
    for (const node of textNodes) {
      if (node.textContent && node.textContent.includes(targetText)) {
        targetNode = node;
        break;
      }
    }

    if (!targetNode) return html;

    const textColor = this.getInheritedTextColor(targetNode.parentElement);

    const nodeSplit = targetNode.textContent.split(targetText);
    if (nodeSplit.length < 2) return html;

    const beforeNode = document.createTextNode(nodeSplit[0]);
    const linkNode = document.createElement("a");
    linkNode.href = url;
    linkNode.style.textDecoration = "none";
    linkNode.style.color = textColor;
    linkNode.textContent = targetText;

    let afterNode = null;
    if (nodeSplit.length > 1 && nodeSplit.slice(1).join(targetText)) {
      afterNode = document.createTextNode(nodeSplit.slice(1).join(targetText));
    }

    const parentNode = targetNode.parentNode;
    parentNode.insertBefore(beforeNode, targetNode);
    parentNode.insertBefore(linkNode, targetNode);
    if (afterNode) {
      parentNode.insertBefore(afterNode, targetNode);
    }
    parentNode.removeChild(targetNode);

    return dom.serialize();
  }

  private getTextNodesNotInLinks(node: Node): Text[] {
    const textNodes: Text[] = [];

    if ((node as Element).tagName === "A") {
      return textNodes;
    }

    if (node.nodeType === 3) {
      textNodes.push(node as Text);
      return textNodes;
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const childTextNodes = this.getTextNodesNotInLinks(node.childNodes[i]);
      textNodes.push(...childTextNodes);
    }

    return textNodes;
  }

  private getInheritedTextColor(element: Element | null): string {
    if (!element) return "#000000";

    let current = element;
    while (current) {
      const inlineStyle = current.getAttribute("style");
      if (inlineStyle) {
        const colorMatch = inlineStyle.match(/color:\s*([^;]+)/i);
        if (colorMatch) return colorMatch[1];
      }

      if (current.hasAttribute("color")) {
        return current.getAttribute("color") || "#000000";
      }

      if (!current.parentElement) break;
      current = current.parentElement;
    }

    return "#000000";
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private findFirstSpecialSymbol(text: string): string | null {
    const match = text.match(/[^\w\s]/);
    return match ? match[0] : null;
  }

  private findLastSpecialSymbol(text: string): string | null {
    const matches = text.match(/[^\w\s]/g);
    return matches && matches.length > 0 ? matches[matches.length - 1] : null;
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
