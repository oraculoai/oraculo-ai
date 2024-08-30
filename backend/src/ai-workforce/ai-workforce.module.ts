import { Module } from '@nestjs/common';
import { AiWorkforceController } from './ai-workforce.controller';
import { AiWorkforceService } from './ai-workforce.service';
import { LangflowModule } from '@/langflow/langflow.module';

@Module({
  imports: [LangflowModule],
  controllers: [AiWorkforceController],
  providers: [AiWorkforceService],
})
export class AiWorkforceModule {}
