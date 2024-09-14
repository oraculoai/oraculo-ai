import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';

@Module({
  exports: [RequestService],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
