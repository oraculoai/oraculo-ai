import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddCreditsDto } from './dto/add-credits.dto';
import { UserDomain } from './domain/user.domain';
import { UserApiKeyDomain } from './domain/user-api-key.domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDomain> {
    const { name, email } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        credits: 10,
      },
    });

    const apiKey = uuidv4();

    await this.prisma.userApiKey.create({
      data: {
        apiKey,
        userId: user.id,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      credits: user.credits,
    };
  }

  async addCredits(addCreditsDto: AddCreditsDto): Promise<UserDomain> {
    const { apiKey, credits } = addCreditsDto;

    // Encontrar o usuário pela chave de API
    const userApiKey = await this.prisma.userApiKey.findUnique({
      where: { apiKey },
      include: { user: true },
    });

    if (!userApiKey) {
      throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
    }

    // Atualizar créditos do usuário
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
    // Encontrar usuário por email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { apiKeys: true },
    });

    if (!user || user.apiKeys.length === 0) {
      return null;
    }

    return {
      apiKey: user.apiKeys[0].apiKey,
    };
  }
}
