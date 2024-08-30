import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskDto } from '@/ai/model/task.dto';
import { TaskDomain } from '@/ai/model/task.domain';
import { AiWorkforceService } from '@/ai-workforce/ai-workforce.service';

@Controller('ai-workforce')
export class AiWorkforceController {
  constructor(private readonly aiWorkforceService: AiWorkforceService) {}

  @Get('/task')
  getAllTasks(): TaskDomain[] {
    return this.aiWorkforceService.getAllTasks();
  }

  @Post('/task')
  newTask(@Body() dto: TaskDto): Promise<TaskDomain> {
    return this.aiWorkforceService.newTask(dto);
  }

  @Patch('/process-task/:id')
  processTask(@Param('id') id: string): Promise<TaskDomain> {
    return this.aiWorkforceService.processTask(id);
  }
}
