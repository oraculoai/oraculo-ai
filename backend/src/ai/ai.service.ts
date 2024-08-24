import { Injectable } from '@nestjs/common';
import { LangflowService } from '@/langflow/langflow.service';
import { MessageDto } from '@/ai/model/message.dto';
import { MessageDomain } from '@/ai/model/message.domain';

@Injectable()
export class AIService {
  constructor(private readonly langflowService: LangflowService) {}

  helloWorld() {
    return this.langflowService.runFlow1('hello-world');
  }

  async createMessage(dto: MessageDto) {
    const flowResult = await this.langflowService.runFlow1(dto.text);

    const messageDomain: MessageDomain = {
      id: String(Math.floor(Math.random())),
      from: 'agent',
      text: flowResult.outputs[0].outputs[0].messages[0].message,
    };

    return messageDomain;
  }
}
