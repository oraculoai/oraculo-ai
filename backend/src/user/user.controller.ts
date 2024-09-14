import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddCreditsDto } from './dto/add-credits.dto';
import { UserDomain } from './domain/user.domain';
import { UserApiKeyDomain } from './domain/user-api-key.domain';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserDomain> {
    try {
      return this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('api-key/:email')
  async getApiKey(
    @Param('email') email: string,
  ): Promise<{ apiKey: UserApiKeyDomain['apiKey'] } | null> {
    const apiKey = await this.userService.getUserApiKey(email);

    if (!apiKey) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return apiKey;
  }

  @Post('credits/add')
  addCredits(@Body() addCreditsDto: AddCreditsDto): Promise<UserDomain> {
    try {
      return this.userService.addCredits(addCreditsDto);
    } catch (error) {
      throw new HttpException(
        'Error adding credits',
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.BAD_REQUEST,
      );
    }
  }
}
