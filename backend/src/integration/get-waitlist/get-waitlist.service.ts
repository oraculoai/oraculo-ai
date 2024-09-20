import { Injectable } from '@nestjs/common';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { WaitlistDomain } from './domain/waitlist.domain';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class GetWaitlistService {
  constructor(private readonly prisma: PrismaService) {}

  async processWebhook(dto: WebhookEventDto): Promise<WaitlistDomain> {
    if (dto.event === 'new_signup') {
      try {
        const data: Prisma.WaitlistCreateInput = {
          email: dto.signup.email,
        };

        return await this.prisma.waitlist.create({ data });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
          return this.prisma.waitlist.update({
            where: { email: dto.signup.email },
            data: { isRemoved: false },
          });
        }

        throw e;
      }
    } else if (dto.event === 'offboarded_signup') {
      return this.prisma.waitlist.upsert({
        where: { email: dto.signup.email },
        create: {
          email: dto.signup.email,
          isRemoved: true,
        },
        update: {
          isRemoved: true,
        },
      });
    }
  }
}
