import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddCreditsDto } from './dto/add-credits.dto';
import { UserDomain } from './domain/user.domain';
import { UserApiKeyDomain } from './domain/user-api-key.domain';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDomain> {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException('Erro ao criar usuário', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('api-key')
  async getApiKey(
    @Body('email') email: string,
  ): Promise<{ apiKey: UserApiKeyDomain['apiKey'] } | null> {
    const apiKey = await this.userService.getUserApiKey(email);

    if (!apiKey) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return apiKey;
  }

  @Post('credits/add')
  addCredits(
    @Body('apiKey') apiKey: string,
    @Body() addCreditsDto: AddCreditsDto,
  ): Promise<UserDomain> {
    try {
      return this.userService.addCredits(apiKey, addCreditsDto);
    } catch (error) {
      throw new HttpException(
        'Erro ao adicionar créditos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
