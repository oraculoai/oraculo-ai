import { Injectable } from '@nestjs/common';
import { LangflowService } from '@/langflow/langflow.service';
import { MessageDto } from '@/ai/model/message.dto';
import { MessageDomain } from '@/ai/model/message.domain';

@Injectable()
export class AIService {
  constructor(private readonly langflowService: LangflowService) {}

  helloWorld(): Promise<any> {
    return this.langflowService.runMemoryChatBot('hello-world');
  }

  async createMessage(dto: MessageDto): Promise<MessageDomain> {
    const flowResult = await this.langflowService.runMemoryChatBot(dto.text);

    const id = String(Math.floor(Math.random()));

    return {
      id,
      from: 'agent',
      text: flowResult.outputs[0].outputs[0].messages[0].message,
    };
  }
}
