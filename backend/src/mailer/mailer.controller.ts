import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from '@/mailer/mailer.service';
import { SendEmailDto } from '@/mailer/dto/send-email.dto';
import { EmailDomain } from '@/mailer/domain/email.domain';
import { ApiTags } from '@nestjs/swagger';

@Controller('mailer')
@ApiTags('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  sendEmail(@Body() dto: SendEmailDto): Promise<EmailDomain | void> {
    return this.mailerService.sendEmail(dto);
  }
}
