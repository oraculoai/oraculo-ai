import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LangflowService } from '@/langflow/langflow.service';

@Injectable()
export class AiWorkforceService {
  private readonly logger = new Logger(AiWorkforceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly langflowService: LangflowService,
  ) {}

  async processRequest(requestId: string): Promise<void> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      this.logger.error(`Request ${requestId} not found`);
      return;
    }

    await this.prisma.request.update({
      where: { id: requestId },
      data: { status: 'processing', processingStartedAt: new Date() },
    });

    const generatedArtifact = await this.runLangflowAgent(request.inputData);

    const artifact = await this.prisma.artifact.create({
      data: {
        requestId: request.id,
        generatedBy: 'Langflow',
        content: generatedArtifact,
      },
    });

    await this.prisma.request.update({
      where: { id: request.id },
      data: { status: 'completed', artifactId: artifact.id },
    });

    this.logger.log(`Request ${requestId} processed successfully.`);
  }

  private runLangflowAgent(inputData: any): Promise<any> {
    return this.langflowService.runMemoryChatBot(inputData);
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
