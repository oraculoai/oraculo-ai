import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskDto } from '@/ai/model/task.dto';
import { TaskDomain } from '@/ai/model/task.domain';
import axios from 'axios';

@Injectable()
export class AiWorkforceService {
  private readonly tasks: TaskDomain[] = [];

  private getTaskById(id: string): TaskDomain {
    return this.tasks.find((task) => task.id === id);
  }

  getAllTasks(): TaskDomain[] {
    return this.tasks;
  }

  async newTask(dto: TaskDto): Promise<TaskDomain> {
    const task: TaskDomain = {
      ...dto,
      id: String(Math.floor(Math.random() * 1_000_000)),
      status: 'pending',
    };

    this.tasks.push(task);

    // Fixme: Simulating OnAddTask event
    axios.patch(`http://localhost:3333/ai-workforce/process-task/${task.id}`);

    return task;
  }

  processTask(id: string): TaskDomain {
    Logger.log(`Processing task with id ${id}`);

    const task = this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.status === 'completed') {
      throw new BadRequestException(`Task with id ${id} is already completed`);
    }

    // TODO: Implement worker logic here

    task.status = 'completed';

    return task;
  }
}
