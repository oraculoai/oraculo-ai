import { Injectable } from '@nestjs/common';
import { extraData } from './model/landing-page.extra-data';
import { ProxyService } from '@/proxy/proxy.service';

@Injectable()
export class LandingPageService {
  private readonly LANDING_PAGE_BASE_URL = process.env.LANDING_PAGE_BASE_URL;

  constructor(private readonly proxyService: ProxyService) {}

  async fetchContent(path: string): Promise<string> {
    return this.proxyService.fetchContent(this.LANDING_PAGE_BASE_URL + path, {
      extraData,
      customFunction: this.removeFramerBadge,
    });
  }

  private removeFramerBadge(data: string): string {
    return data.replace('<div id="__framer-badge-container"></div>', '');
  }
}
