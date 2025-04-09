import { Injectable, Logger } from '@nestjs/common';
import * as prettier from 'prettier';
import { HTMLFormatterPayload } from './html-formatter.payload';

@Injectable()
export class HtmlFormatterService {
  private readonly logger: Logger = new Logger(HtmlFormatterService.name, {
    timestamp: true,
  });

  public async formatHtml(
    payload: HTMLFormatterPayload
  ): Promise<string> {
    const { html, ...options } = payload;
    if (!html || html.trim() === '') {
      return '';
    }

    try {
      const prettierOptions = {
        parser: 'html',
        printWidth: options.printWidth || 100,
        tabWidth: options.tabWidth || 2,
        useTabs: options.useTabs || false,
        htmlWhitespaceSensitivity: options.htmlWhitespaceSensitivity || 'css',
      };

      const formattedHtml = await prettier.format(html, prettierOptions);
      return formattedHtml;
    } catch (error) {
      return html;
    }
  }
}