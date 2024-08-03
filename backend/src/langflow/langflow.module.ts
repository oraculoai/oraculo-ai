import { Module } from '@nestjs/common';
import { LangflowService } from './langflow.service';

@Module({
  providers: [LangflowService],
  exports: [LangflowService],
})
export class LangflowModule {}
