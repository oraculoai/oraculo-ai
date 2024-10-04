import { Body, Controller, Post } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { ApiTags } from '@nestjs/swagger';
import { JoinWaitlistDto } from '@/waitlist/dto/join-waitlist.dto';
import { WaitlistDomain } from '@/waitlist/domain/waitlist.domain';

@Controller('waitlist')
@ApiTags('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('join')
  joinWaitlist(@Body() dto: JoinWaitlistDto): Promise<WaitlistDomain> {
    return this.waitlistService.joinWaitlist(dto);
  }
}
