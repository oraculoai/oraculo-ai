import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { LangflowModule } from '@/langflow/langflow.module';

@Module({
  imports: [LangflowModule],
  controllers: [AIController],
  providers: [AIService],
})
export class AIModule {}
