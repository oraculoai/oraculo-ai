import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestDomain } from './domain/request.domain';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(dto: CreateRequestDto): Promise<RequestDomain> {
    const userApiKey = await this.prisma.userApiKey.findUnique({
      where: { apiKey: dto.apiKey },
    });

    if (!userApiKey) {
      throw new BadRequestException('Invalid API key');
    }

    // Create Request
    const request = await this.prisma.request.create({
      data: {
        apiKey: dto.apiKey,
        userId: userApiKey.userId,
        agentSlug: dto.agentSlug,
        sessionId: dto.sessionId || Math.random().toString(36).substring(7),
        inputData: dto.inputData,
        status: 'pending',
      },
    });

    await this.updateUserCredit(userApiKey.userId, -1);

    return {
      id: request.id,
      userId: request.userId,
      agentSlug: request.agentSlug,
      sessionId: request.sessionId,
      inputData: request.inputData,
      status: request.status,
    };
  }

  async updateUserCredit(userId: string, number: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: number } },
    });
  }

  async getRequestStatus(requestId: string): Promise<RequestDomain | null> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return null;
    }

    return {
      id: request.id,
      userId: request.userId,
      agentSlug: request.agentSlug,
      sessionId: request.sessionId,
      inputData: request.inputData,
      status: request.status,
      processingStartedAt: request.processingStartedAt,
      result: request.result,
    };
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    failureReason?: string,
  ): Promise<void> {
    await this.prisma.request.update({
      where: { id: requestId },
      data: { status, failureReason },
    });
  }

  async completeRequestWithArtifact(
    requestId: string,
    artifactId: string,
  ): Promise<void> {
    await this.prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'completed',
        artifact: { connect: { id: artifactId } },
      },
    });
  }

  async getRequestById(requestId: string): Promise<RequestDomain | null> {
    return this.prisma.request.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        userId: true,
        agentSlug: true,
        sessionId: true,
        inputData: true,
        status: true,
        processingStartedAt: true,
        result: true,
      },
    });
  }

  getPendingRequest(): Promise<RequestDomain | null> {
    return this.prisma.request.findFirst({
      where: { status: 'pending' },
    });
  }
}
