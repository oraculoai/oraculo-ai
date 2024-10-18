import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LangflowService } from '@/langflow/langflow.service';
import { RequestService } from '@/request/request.service';
import { ArtifactDomain } from '@/ai-workforce/domain/artifact.domain';
import { MailerService } from '@/mailer/mailer.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class AiWorkforceService {
  private readonly logger = new Logger(AiWorkforceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly langflowService: LangflowService,
    private readonly requestService: RequestService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async startProcess(requestId: string): Promise<ArtifactDomain> {
    const request = await this.requestService.getRequestById(requestId);

    if (!request) {
      throw new NotFoundException(`Request ${requestId} not found`);
    }

    try {
      await this.requestService.updateRequestStatus(requestId, 'processing');
      this.logger.log(`Processing request ${requestId}`);

      const generatedArtifact = await this.runLangflowAgent(
        request.agentSlug,
        request.inputData,
        request.sessionId,
      );

      this.logger.log(`Generated artifact for request ${requestId}`);

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

      // Send artifact to email
      const user = await this.userService.getUserById(request.userId);
      await this.mailerService.sendEmail({
        recipients: [{ email: user.email, name: user.name }],
        subject: 'Your request has been processed!',
        message: `
        <p>
          Hi ${user.name},
        </p>
        <p>
          Your request has been processed successfully.
        </p>
        <p>
          Here is the generated content:
        </p>
        <p>
          ${content}
        </p>
        `,
      });

      return artifact;
    } catch (e) {
      this.logger.error(`Error processing request ${requestId}`, e);

      // Update request status to failed
      await this.requestService.updateRequestStatus(
        requestId,
        'failed',
        e['message'] || 'Unknown error',
      );

      // Refund user credit
      await this.requestService.updateUserCredit(request.userId, 1);

      throw e;
    }
  }

  private async runLangflowAgent(
    flowIdOrSlug: string,
    inputData: any,
    sessionId?: string,
  ): Promise<any> {
    return this.langflowService.runFlow(flowIdOrSlug, inputData, sessionId);
  }

  async getArtifact(requestId: string): Promise<any> {
    const artifact = await this.prisma.artifact.findUnique({
      where: { requestId },
    });

    if (!artifact) {
      throw new NotFoundException(
        `Artifact not found for request ${requestId}`,
      );
    }

    return artifact;
  }

  async startProcessPending(): Promise<ArtifactDomain> {
    const pendingRequest = await this.requestService.getPendingRequest();

    if (!pendingRequest) {
      throw new NotFoundException('No pending request found');
    }

    return this.startProcess(pendingRequest.id);
  }
}
