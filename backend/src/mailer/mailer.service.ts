import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '@/mailer/dto/send-email.dto';
import { EmailParams, MailerSend, Recipient } from 'mailersend';
import { APIResponse } from 'mailersend/lib/services/request.service';

@Injectable()
export class MailerService {
  async sendEmail(dto: SendEmailDto): Promise<APIResponse> {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });

    const recipients = dto.recipients.map(
      (recipient) => new Recipient(recipient.email, recipient.name),
    );

    const emailParams = new EmailParams({})
      .setFrom({
        email: 'MS_Bh9c8t@trial-7dnvo4dpd3345r86.mlsender.net',
        name: 'Oraculo AI',
      })
      .setReplyTo({
        email: 'oraculoai.bot@gmail.com',
        name: 'Oraculo AI',
      })
      .setTo(recipients)
      .setSubject(dto.subject)
      .setHtml(dto.message)
      .setText(dto.message);

    const emailResponse = await mailerSend.email.send(emailParams);

    if (emailResponse.statusCode !== 202) {
      throw new Error('Failed to send email');
    }

    return emailResponse;
  }
}
