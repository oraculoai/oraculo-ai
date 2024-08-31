import { Controller, Patch } from '@nestjs/common';
import { LangGraphService } from './langgraph.service';

@Controller('langgraph')
export class LangGraphController {
  constructor(private readonly langGraphService: LangGraphService) {}
  @Patch()
  run(): Promise<void> {
    // @Body() dto: RunDto,
    return this.langGraphService.run();
  }
}
