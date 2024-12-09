import { Controller, Get, Req, Res } from '@nestjs/common';
import { LandingPageService } from './landing-page.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

export const LANDING_PAGE_PATH = '/landing-page';

@ApiTags('Landing Page')
@Controller()
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Get(LANDING_PAGE_PATH + '*')
  async index(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response | void> {
    const path = req.originalUrl.replace(LANDING_PAGE_PATH, '');

    const acceptLanguageHeader = req.headers['accept-language'];
    const isPtBrPreferred =
      prefersLanguage(acceptLanguageHeader, 'pt') ||
      prefersLanguage(acceptLanguageHeader, 'pt-br');
    const isEnPreferred =
      prefersLanguage(acceptLanguageHeader, 'en') ||
      prefersLanguage(acceptLanguageHeader, 'en-us');

    if (isPtBrPreferred) {
      if (path === '') {
        return res.redirect(301, '/pt-br');
      }
    } else if (isEnPreferred) {
      if (path === '/pt-br') {
        return res.redirect(301, '/');
      }
    }

    return res.send(await this.landingPageService.fetchContent(path));
  }
}

function prefersLanguage(
  acceptLanguage: string | undefined,
  language: string,
): boolean {
  if (!acceptLanguage) {
    return false;
  }

  const languages = acceptLanguage.split(',').map((lang) => {
    const [code, quality] = lang.trim().split(';q=');
    return {
      code,
      quality: quality ? parseFloat(quality) : 1.0,
    };
  });

  languages.sort((a, b) => b.quality - a.quality);

  return languages.some((lang) => lang.code.toLowerCase() === language);
}
