import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AiWorkforceService } from './ai-workforce.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('ai-workforce')
@ApiTags('ai-workforce')
export class AiWorkforceController {
  constructor(
    private readonly aiWorkforceService: AiWorkforceService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('start-process/:requestId')
  async startProcess(@Param('requestId') requestId: string): Promise<void> {
    try {
      await this.aiWorkforceService.startProcess(requestId);
    } catch (error) {
      throw new HttpException('Error starting process', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('artifact/:requestId')
  getArtifact(@Param('requestId') requestId: string): Promise<any> {
    try {
      return this.aiWorkforceService.getArtifact(requestId);
    } catch (error: any) {
      throw new HttpException(
        'Error retrieving artifact',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('status/:requestId')
  async getRequestStatus(@Param('requestId') requestId: string): Promise<any> {
    try {
      const request = await this.prisma.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
      }

      return {
        requestId: request.id,
        status: request.status,
        processingStartedAt: request.processingStartedAt,
        artifactId: request.artifactId || null,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error retrieving request status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
