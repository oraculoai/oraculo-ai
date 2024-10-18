import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JoinWaitlistDto } from '@/waitlist/dto/join-waitlist.dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { WaitlistDomain } from '@/waitlist/domain/waitlist.domain';
import { MailerService } from '@/mailer/mailer.service';
import { joinedWaitlist } from '@/mailer/templates/joined-waitlist';

@Injectable()
export class WaitlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async joinWaitlist(dto: JoinWaitlistDto): Promise<WaitlistDomain> {
    try {
      const data: Prisma.WaitlistCreateInput = { ...dto };

      await this.prisma.waitlist.create({
        data,
        select: { id: true, email: true },
      });

      // Send email to user
      await this.mailerService.sendEmail({
        recipients: [{ name: dto.email, email: dto.email }],
        ...joinedWaitlist(dto.email),
      });

      // Send email to OraculoAI
      await this.mailerService.sendEmail({
        recipients: [{ name: 'OraculoAI', email: 'oraculoai.bot@gmail.com' }],
        subject: 'New user joined the waitlist',
        message: `
        <p>
          A new user with email ${dto.email} has joined the waitlist.
        </p>
      `,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return this.prisma.waitlist.update({
          where: { email: dto.email },
          data: { isRemoved: false },
          select: { id: true, email: true },
        });
      }

      throw e;
    }
  }

  remove(email: string): Promise<WaitlistDomain> {
    return this.prisma.waitlist.update({
      where: { email },
      data: { isRemoved: true },
    });
  }
}
