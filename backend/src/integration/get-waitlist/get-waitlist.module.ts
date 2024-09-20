import { Module } from '@nestjs/common';
import { GetWaitlistService } from './get-waitlist.service';
import { GetWaitlistController } from './get-waitlist.controller';

@Module({
  controllers: [GetWaitlistController],
  providers: [GetWaitlistService],
  exports: [GetWaitlistService],
})
export class GetWaitlistModule {}