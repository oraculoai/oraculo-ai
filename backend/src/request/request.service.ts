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

    const request = await this.prisma.request.create({
      data: {
        apiKey: dto.apiKey,
        userId: userApiKey.userId,
        agentSlug: dto.agentSlug,
        inputData: dto.inputData,
        status: 'pending',
      },
    });

    return {
      id: request.id,
      agentSlug: request.agentSlug,
      inputData: request.inputData,
      status: request.status,
    };
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
      agentSlug: request.agentSlug,
      inputData: request.inputData,
      status: request.status,
      processingStartedAt: request.processingStartedAt,
      result: request.result,
    };
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
  ): Promise<void> {
    await this.prisma.request.update({
      where: { id: requestId },
      data: { status },
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
        artifactId,
      },
    });
  }

  async getRequestById(requestId: string): Promise<RequestDomain | null> {
    return this.prisma.request.findUnique({
      where: { id: requestId },
    });
  }
}
