import { Controller, Get } from '@nestjs/common';
import { AIService } from '@/ai/ai.service';
import { ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';

export const AI_PATH = '/ai';

@ApiTags('AI')
@Controller(AI_PATH)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('/hello-world')
  helloWorld(): Promise<AxiosResponse<any>> {
    return this.aiService.helloWorld();
  }
}
