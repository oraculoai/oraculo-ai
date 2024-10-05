import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestDomain } from './domain/request.domain';
import { ApiTags } from '@nestjs/swagger';

@Controller('request')
@ApiTags('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  async createRequest(@Body() dto: CreateRequestDto): Promise<RequestDomain> {
    return this.requestService.createRequest(dto);
  }

  @Get('status/:requestId')
  async getRequestStatus(
    @Param('requestId') requestId: string,
  ): Promise<RequestDomain> {
    const requestStatus = await this.requestService.getRequestStatus(requestId);
    if (!requestStatus) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }
    return requestStatus;
  }
}
