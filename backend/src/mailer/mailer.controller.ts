import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from '@/mailer/mailer.service';
import { SendEmailDto } from '@/mailer/dto/send-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { APIResponse } from 'mailersend/lib/services/request.service';

@Controller('mailer')
@ApiTags('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  sendEmail(@Body() dto: SendEmailDto): Promise<APIResponse> {
    return this.mailerService.sendEmail(dto);
  }
}
