import { Injectable } from '@nestjs/common';
import { LangflowService } from '@/langflow/langflow.service';

@Injectable()
export class AIService {
  constructor(private readonly langflowService: LangflowService) {}

  helloWorld() {
    return this.langflowService.runFlow1();
  }
}
