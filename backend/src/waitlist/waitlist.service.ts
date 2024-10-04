import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JoinWaitlistDto } from '@/waitlist/dto/join-waitlist.dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { WaitlistDomain } from '@/waitlist/domain/waitlist.domain';

@Injectable()
export class WaitlistService {
  constructor(private readonly prisma: PrismaService) {}

  async joinWaitlist(dto: JoinWaitlistDto): Promise<WaitlistDomain> {
    try {
      const data: Prisma.WaitlistCreateInput = {
        ...dto,
      };

      return await this.prisma.waitlist.create({
        data,
        select: { id: true, email: true },
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
