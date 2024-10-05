import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinWaitlistDto {
  @ApiProperty({
    example: 'oraculoai.bot@gmail.com',
  })
  @IsEmail()
  email: string;
}
