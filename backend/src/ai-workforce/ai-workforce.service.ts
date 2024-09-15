import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LangflowService } from '@/langflow/langflow.service';
import { RequestService } from '@/request/request.service';
import { ArtifactDomain } from '@/ai-workforce/domain/artifact.domain';

@Injectable()
export class AiWorkforceService {
  private readonly logger = new Logger(AiWorkforceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly langflowService: LangflowService,
    private readonly requestService: RequestService,
  ) {}

  async startProcess(requestId: string): Promise<ArtifactDomain> {
    const request = await this.requestService.getRequestById(requestId);

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    await this.requestService.updateRequestStatus(requestId, 'processing');

    const flowConfig = await this.getFlowConfigBySlug(request.agentSlug);

    if (!flowConfig) {
      this.logger.error(`Flow config for slug ${request.agentSlug} not found`);
      throw new Error(`Flow config for slug ${request.agentSlug} not found`);
    }

    const generatedArtifact = await this.runLangflowAgent(
      flowConfig.flowId,
      request.inputData,
    );

    const content =
      generatedArtifact['outputs']?.[0]?.['outputs']?.[0]?.['results']?.[
        'message'
      ]?.['text'];

    const artifact = await this.prisma.artifact.create({
      data: {
        requestId: requestId,
        generatedBy: request.agentSlug,
        content,
      },
    });

    await this.requestService.completeRequestWithArtifact(
      requestId,
      artifact.id,
    );

    this.logger.log(`Request ${requestId} processed successfully.`);

    return artifact;
  }

  private async getFlowConfigBySlug(
    slug: string,
  ): Promise<{ flowId: string } | null> {
    const flowConfigMap = {
      'blog-post': {
        flowId: process.env.LANGFLOW_BLOG_FLOW_ID,
      },
      'memory-chatbot': {
        flowId: process.env.LANGFLOW_MEMORY_CHATBOT_FLOW_ID,
      },
    };

    return flowConfigMap[slug] || null;
  }

  private async runLangflowAgent(flowId: string, inputData: any): Promise<any> {
    return this.langflowService.runFlow(flowId, inputData);
  }

  async getArtifact(requestId: string): Promise<any> {
    const artifact = await this.prisma.artifact.findUnique({
      where: { requestId },
    });

    if (!artifact) {
      throw new Error(`Artifact not found for request ${requestId}`);
    }

    return artifact;
  }
}
