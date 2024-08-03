import { Controller, Get } from '@nestjs/common';
import { AIService } from '@/ai/ai.service';
import { ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';

export const AI_PATH = '/ai';

@ApiTags('AI')
@Controller(AI_PATH)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('/upload-files')
  uploadFiles(): Promise<AxiosResponse<any>> {
    return this.aiService.uploadFiles();
  }
}
