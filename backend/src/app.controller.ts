import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CONFIG } from '@/bootstrap';

@ApiTags('Status')
@Controller()
export class AppController {
  @Get(['/status', '/'])
  @ApiOperation({
    description: 'Show application status.',
  })
  getAppStatus(@Req() req: Request): {
    status: string;
    api: string;
    docs: string;
    stage: string;
  } {
    const host = req.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const stage = process.env.STAGE;
    const baseUrl =
      `${req.baseUrl}/` + (CONFIG.runMode === 'serverless' ? `${stage}/` : '');
    const apiUrl = `${protocol}://${host}${baseUrl}`;

    return {
      status: 'Welcome to OraculoAI API! 🚀',
      api: apiUrl,
      docs: apiUrl + 'docs/',
      stage,
    };
  }
}
