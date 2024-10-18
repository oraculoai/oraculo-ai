import { Injectable } from '@nestjs/common';
import { SendEmailDto } from '@/mailer/dto/send-email.dto';
import { EmailParams, MailerSend, Recipient } from 'mailersend';
import { APIResponse } from 'mailersend/lib/services/request.service';
import Mailgun, { MessagesSendResult } from 'mailgun.js';
import FormData from 'form-data';
import { EmailDomain } from '@/mailer/domain/email.domain';

@Injectable()
export class MailerService {
  async sendEmail(dto: SendEmailDto): Promise<EmailDomain> {
    const emailSent = await this.sendEmailWithMailGun(dto);

    return {
      status: emailSent.status,
      message: emailSent.message,
    };
  }

  async sendEmailWithMailerSend(dto: SendEmailDto): Promise<APIResponse> {
    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });

    const recipients = dto.recipients.map(
      (recipient) => new Recipient(recipient.email, recipient.name),
    );

    const emailParams = new EmailParams({})
      .setFrom({
        email: 'MS_BYSsmG@trial-7dnvo4dpd3345r86.mlsender.net',
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

  async sendEmailWithMailGun(dto: SendEmailDto): Promise<MessagesSendResult> {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    });

    return mg.messages.create(
      'sandboxd1fec2158ebd43d7aa273833fb0490e3.mailgun.org',
      {
        from: 'OraculoAI <mailgun@sandboxd1fec2158ebd43d7aa273833fb0490e3.mailgun.org>',
        to: dto.recipients.map((recipient) => recipient.email),
        subject: dto.subject,
        text: dto.message,
        html: dto.message,
      },
    );
  }
}
