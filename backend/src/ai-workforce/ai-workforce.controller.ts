import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { AiWorkforceService } from './ai-workforce.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('ai-workforce')
@ApiTags('ai-workforce')
export class AiWorkforceController {
  private readonly logger = new Logger(AiWorkforceController.name);

  constructor(
    private readonly aiWorkforceService: AiWorkforceService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('generate-artifact')
  async generateArtifact(
    @Body() requestData: any,
  ): Promise<{ requestId: string }> {
    try {
      const newRequest = await this.prisma.request.create({
        data: {
          apiKey: requestData.apiKey,
          userId: requestData.userId,
          inputData: requestData,
          status: 'pending',
        },
      });

      this.aiWorkforceService.processRequest(newRequest.id);

      this.logger.log(
        `Request ${newRequest.id} created and processing started.`,
      );
      return { requestId: newRequest.id };
    } catch (error: any) {
      this.logger.error(`Error creating request: ${error.message}`);
      throw new HttpException('Error creating request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('artifact/:requestId')
  getArtifact(@Param('requestId') requestId: string): Promise<any> {
    try {
      return this.aiWorkforceService.getArtifact(requestId);
    } catch (error: any) {
      this.logger.error(
        `Error retrieving artifact for request ${requestId}: ${error.message}`,
      );

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

      this.logger.error(
        `Error retrieving status for request ${requestId}: ${error.message}`,
      );

      throw new HttpException(
        'Error retrieving request status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
