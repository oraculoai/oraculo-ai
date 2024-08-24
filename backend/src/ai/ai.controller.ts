import { Body, Controller, Get, Post } from '@nestjs/common';
import { AIService } from '@/ai/ai.service';
import { ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { MessageDto } from '@/ai/model/message.dto';
import { MessageDomain } from '@/ai/model/message.domain';

export const AI_PATH = '/ai';

@ApiTags('AI')
@Controller(AI_PATH)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('/hello-world')
  getHelloWorld(): Promise<AxiosResponse<any>> {
    return this.aiService.helloWorld();
  }

  @Post('/message')
  postHelloWorld(@Body() dto: MessageDto): Promise<MessageDomain> {
    return this.aiService.createMessage(dto);
  }
}
