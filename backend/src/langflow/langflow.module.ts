import { Module } from '@nestjs/common';
import { LangflowService } from './langflow.service';

@Module({
  exports: [LangflowService],
  providers: [LangflowService],
})
export class LangflowModule {}
