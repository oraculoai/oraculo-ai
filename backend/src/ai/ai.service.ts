import { Injectable } from '@nestjs/common';
import { LangflowService } from '@/langflow/langflow.service';

@Injectable()
export class AIService {
  constructor(private readonly langflowService: LangflowService) {}

  uploadFiles() {
    return this.langflowService.uploadFiles();
  }
}
