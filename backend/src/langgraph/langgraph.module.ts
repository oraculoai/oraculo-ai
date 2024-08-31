import { Module } from '@nestjs/common';
import { LangGraphService } from './langgraph.service';
import { LangGraphController } from './langgraph.controller';

@Module({
  controllers: [LangGraphController],
  providers: [LangGraphService],
})
export class LangGraphModule {}
