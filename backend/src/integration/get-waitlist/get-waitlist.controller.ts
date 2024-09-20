import { Body, Controller, Post } from '@nestjs/common';
import { GetWaitlistService } from './get-waitlist.service';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { WaitlistDomain } from './domain/waitlist.domain';
import { ApiTags } from '@nestjs/swagger';

@Controller('integration/get-waitlist')
@ApiTags('integration/get-waitlist')
export class GetWaitlistController {
  constructor(private readonly getWaitlistService: GetWaitlistService) {}

  @Post()
  webhook(@Body() dto: WebhookEventDto): Promise<WaitlistDomain> {
    return this.getWaitlistService.processWebhook(dto);
  }
}
