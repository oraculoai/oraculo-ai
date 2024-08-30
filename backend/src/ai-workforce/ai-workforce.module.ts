import { Module } from '@nestjs/common';
import { AiWorkforceController } from './ai-workforce.controller';
import { AiWorkforceService } from './ai-workforce.service';

@Module({
  controllers: [AiWorkforceController],
  providers: [AiWorkforceService],
})
export class AiWorkforceModule {}
