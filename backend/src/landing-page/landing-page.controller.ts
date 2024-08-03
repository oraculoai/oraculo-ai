import { Controller, Get, Req } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

export const LANDING_PAGE_PATH = '/landing-page';

@ApiTags('Landing Page')
@Controller()
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Get(LANDING_PAGE_PATH + '*')
  async index(@Req() req: Request): Promise<string> {
    const path = req.originalUrl.replace(LANDING_PAGE_PATH, '');

    return this.landingPageService.fetchContent(path);
  }
}
