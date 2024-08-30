import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskDto } from '@/ai/model/task.dto';
import { TaskDomain } from '@/ai/model/task.domain';
import axios from 'axios';
import { LangflowService } from '@/langflow/langflow.service';

const agentChiefMarketingOfficer = {
  name: 'Chief Marketing Officer (CMO)',
};

const digitalMarketingManager = {
  name: 'Digital Marketing Manager',
};
const contentMarketingSpecialist = {
  name: 'Content Marketing Specialist',
};

const agents = [
  agentChiefMarketingOfficer,
  digitalMarketingManager,
  contentMarketingSpecialist,
];

const executionActionPlanInstructions1 = (data: {
  userPrompt: string;
  context: string;
}): string => `
# User Problem:
${data.userPrompt}

# Context:
- User asked a Multi Agent System to solve a problem
${data.context}

# Instructions:
- Create a list of tasks that need to be done

# Constants:
- Max Number of Tasks: 5

# Task Structure:
{
  "task": "[Task Description]",
}

# Expected Output:
- JSON Array of Tasks
- Content-Type: application/json
- Do not add any \`\`\`json\`\`\` code blocks
`;

const executionActionPlanInstructions2 = (data: {
  userPrompt: string;
  context: string;
  tasks: string;
}): string => `
# User Problem:
${data.userPrompt}

# Context:
${data.context}

# Agents Available:
${JSON.stringify(agents)}

# Instructions:
- Given a list of tasks, prioritize them
- Delegate each task to the right agent

# Tasks:
${data.tasks}

# Task Priority:
- High
- Medium
- Low

# Task Structure:
{
  "task": "[Task Description]",
  "priority": "[Task Priority]",
  "assignedTo": "[Agent Name]"
}

# Expected Output:
- Content-Type: application/json
- JSON Array of Tasks
`;

const executeTaskInstructions = (data: {
  userPrompt: string;
  context: string;
  task: string;
}): string => `
# User Problem
${data.userPrompt}

# Context:
${data.context}

# Instructions:
- Given a task, execute it

# Task:
${data.task}

# Expected Output:
- Content-Type: text/markdown
- Only the information needed to complete the task
`;

@Injectable()
export class AiWorkforceService {
  private readonly phases = [
    // Research
    {
      name: 'Planning',
      agent: agentChiefMarketingOfficer,
      steps: [
        // { name: 'Analyze' },
        {
          name: 'Create the execution action plan with tasks',
          instructions: executionActionPlanInstructions1,
        },
        {
          name: 'Prioritize and delegate tasks',
          instructions: executionActionPlanInstructions2,
        },
      ],
    },
    {
      name: 'Execution',
      steps: [
        // { name: 'Analyze' },
        // { name: 'Create the action plan to execute the task' },
        {
          name: 'Execute the task',
          instructions: executeTaskInstructions,
        },
        // { name: 'Ask for review' },
        // { name: 'CMO do the Review' },
        // { name: 'Approve: Next Task' },
        // { name: 'Request Changes: Re-do Step' },
        // { name: 'After X Tasks: Ask For Human Input' },
      ],
    },
    // {
    //   name: 'Delivery',
    //   agent: agentChiefMarketingOfficer,
    //   steps: [
    //     { name: 'Save output' },
    //     { name: 'Deliver do user' },
    //     { name: 'Mark task as completed' },
    //   ],
    // },
    // Monitoring
    // Analysis
  ];

  private readonly tasks: TaskDomain[] = [];

  constructor(private readonly langflowService: LangflowService) {}

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
      artifacts: [],
    };

    this.tasks.push(task);

    // Fixme: Simulating OnAddTask event
    axios.patch(`http://localhost:3333/ai-workforce/process-task/${task.id}`);

    return task;
  }

  async processTask(id: string): Promise<TaskDomain> {
    Logger.log(`Processing task with id ${id}`, AiWorkforceService.name);

    const task = this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.status === 'completed') {
      throw new BadRequestException(`Task with id ${id} is already completed`);
    }

    // TODO: Implement worker logic here

    // When a task starts processing, we need to run all the phases
    // Each phase has a set of steps that need to be executed
    // Each step has a set of agents that can execute it

    const context: string[] = [];
    const userPrompt = task.description;
    const sessionId = task.id;
    let actionPlanItems = [];
    const currentActionItemId = 0;

    // TODO: Threat each phase separately
    // Planning
    // Logger.debug(`[Planning] Phase Started`, AiWorkforceService.name);
    //
    // const planningPhase = this.phases[0];
    // for (const [stepId, step] of Object.entries(planningPhase)) {
    //   Logger.debug(
    //     `[Planning] [Step ${stepId}] Processing...`,
    //     AiWorkforceService.name,
    //   );
    // }
    // Execution
    // Delivery

    // For each phase
    for (const [phaseId, phase] of Object.entries(this.phases)) {
      Logger.debug(`[Phase ${phaseId}] Processing...`, AiWorkforceService.name);

      // For each step
      for (const stepId in phase.steps) {
        const step = phase.steps[stepId];

        Logger.debug(
          `[Phase ${phaseId}] [Step ${stepId}] Processing...`,
          AiWorkforceService.name,
        );

        const data = {
          userPrompt,
          context: context.map((c) => `- ${c}`).join('\n'),
        };

        // Planning phase
        if (step.name === 'Create the execution action plan with tasks') {
          // Empty
        } else if (step.name === 'Prioritize and delegate tasks') {
          data['tasks'] = JSON.stringify(actionPlanItems);
        }

        // Execution phase
        if (step.name === 'Execute the task') {
          data['task'] = JSON.stringify(actionPlanItems[currentActionItemId]);
        }

        // FIXME: Remove any: adjust step.instructions to accept Record<string, unknown>
        const agentPrompt = step.instructions(data as any);

        Logger.debug(
          `[Phase ${phaseId}] [Step ${stepId}] Talking to agent...`,
          AiWorkforceService.name,
        );

        const agentResponseData = await this.langflowService.runLocalMemoryBot(
          sessionId,
          agentPrompt,
        );

        const agentOutput =
          agentResponseData.outputs[0].outputs[0].results.message.text;

        step['artifacts'] = [agentOutput];

        // Execution phase
        if (step.name === 'Execute the task') {
          // Remove the processed action item from list
          actionPlanItems.splice(currentActionItemId, 1);
        }

        const shortAgentResponse = agentOutput?.substring(0, 40);

        Logger.debug(
          `[Phase ${phaseId}] [Step ${stepId}] Agent response: ${shortAgentResponse}...`,
          AiWorkforceService.name,
        );

        // Update action plan tasks
        if (
          phase.name === 'Planning' &&
          (step.name === 'Create the execution action plan with tasks' ||
            step.name === 'Prioritize and delegate tasks')
        ) {
          try {
            actionPlanItems = JSON.parse(agentOutput);
          } catch (e) {
            Logger.error(
              'CRITICAL: Error converting agent response to action plan items',
              e,
              AiWorkforceService.name,
            );
          }
        }

        // // Execute the task
        // if (phase.name === 'Execution' && step.name === 'Execute the task') {
        // }

        if (step.name === 'Create the execution action plan with tasks') {
          context.push('CMO created a list of tasks');
        } else if (step.name === 'Prioritize and delegate tasks') {
          context.push('CMO prioritized and delegated tasks');
        }

        if (step.name === 'Execute the task') {
          // Check if Action Plan Tasks are completed
          if (actionPlanItems.length !== 0) {
            Logger.debug(
              `[Phase ${phaseId}] [Step ${stepId}] Action Plan Tasks not completed. Continuing...`,
              AiWorkforceService.name,
            );

            phase.steps.push({
              name: 'Execute the task',
              // FIXME: fix data type
              instructions: executeTaskInstructions as any,
            });
          }
        }
      }
    }

    task.status = 'completed';
    Logger.log(`Task with id ${id} completed`, AiWorkforceService.name);

    return task;
  }
}
