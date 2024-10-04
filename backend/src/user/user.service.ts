import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddCreditsDto } from './dto/add-credits.dto';
import { UserDomain } from './domain/user.domain';
import { UserApiKeyDomain } from './domain/user-api-key.domain';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailerService } from '@/mailer/mailer.service';
import { WaitlistService } from '@/waitlist/waitlist.service';

const INITIAL_CREDITS = 1;

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly waitlistService: WaitlistService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDomain> {
    try {
      // Create User and API Key
      const { name, email } = createUserDto;
      const apiKey = uuidv4();
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          credits: INITIAL_CREDITS,
          apiKeys: {
            create: { apiKey },
          },
        },
      });

      // Remove if the user is on waitlist
      await this.waitlistService.remove(email).catch((e) => {
        Logger.error('Error removing user from waitlist', e, UserService.name);
      });

      // Send email
      const message = `
        <p>
          Hi ${name},
        </p>
        <p>
          Welcome to OraculoAI! We are excited to have you on board.
        </p>
        <p>
          Your API key is: <strong>${apiKey}</strong>
        </p>
        <p>
          You have been credited with ${INITIAL_CREDITS} free credits to get started.
        </p>
        <p>
          If you have any questions, feel free to reach out to us at
          <a href="mailto:oraculoai.bot@gmail.com">oraculoai.bot@gmail.com</a>.
        </p>
        <p>
          Best,
          <br />
          OraculoAI Team
        </p>
      `;
      await this.mailerService.sendEmail({
        recipients: [{ name, email }],
        subject: 'Welcome to OraculoAI!',
        html: message,
        text: message,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('User already exists');
      }
    }
  }

  async addCredits(addCreditsDto: AddCreditsDto): Promise<UserDomain> {
    const { apiKey, credits } = addCreditsDto;

    const userApiKey = await this.prisma.userApiKey.findUnique({
      where: { apiKey },
      include: { user: true },
    });

    if (!userApiKey) {
      throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userApiKey.userId },
      data: {
        credits: { increment: credits },
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      credits: updatedUser.credits,
    };
  }

  async getUserApiKey(
    email: string,
  ): Promise<{ apiKey: UserApiKeyDomain['apiKey'] } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { apiKeys: true },
    });

    if (!user || user.apiKeys.length === 0) {
      return null;
    }

    return {
      apiKey: user.apiKeys[0]?.apiKey,
    };
  }
}
