import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProxyService {
  async fetchContent(
    targetUrl: string,
    options?: {
      extraData?: string;
      customFunction?: (data: string) => string;
      replaceUrlFrom?: string;
      replaceUrlTo?: string;
      originalUrl?: string;
    },
  ): Promise<string> {
    const url = `${targetUrl}`;

    try {
      // Load Data
      const { data } = await axios.get(url);

      let content = data;

      if (
        options?.replaceUrlFrom &&
        options?.replaceUrlTo &&
        options?.originalUrl
      ) {
        // Fix Links (CSS)
        content = content.replace(
          new RegExp(`<link([^>]*?)href="${options.replaceUrlFrom}`, 'g'),
          `<link$1href="${options.originalUrl}`,
        );

        // Fix Scripts
        content = content.replace(
          new RegExp(`<script([^>]*?)src="${options.replaceUrlFrom}`, 'g'),
          `<script$1src="${options.originalUrl}`,
        );

        // Fix Anchors
        content = content.replace(
          new RegExp(`<a([^>]*?)href="${options.replaceUrlFrom}`, 'g'),
          `<a$1href="${options.replaceUrlTo}`,
        );
      }

      // Add extra data, if any
      if (options?.extraData) {
        content = content.replace('</body>', `${options.extraData}</body>`);
      }

      // Run custom function, if any
      if (options?.customFunction) {
        content = options.customFunction(content);
      }

      return content;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Logger.error(
          `Axios Error at Proxy. URL: ${url}\n${err.message}`,
          err.stack,
          ProxyService.name,
        );
      } else if (err instanceof Error) {
        Logger.error(
          `Error at Proxy. URL: ${url}\n${err.message}`,
          err.stack,
          ProxyService.name,
        );
      } else {
        Logger.error(err, ProxyService.name);
      }

      throw new NotFoundException();
    }
  }
}
