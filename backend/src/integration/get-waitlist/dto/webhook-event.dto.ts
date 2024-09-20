import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SignupPayload {
  @IsEmail()
  email: string;

  // amount_referred: number;
  // created_at: string;
  // priority: number;
  // referral_link: string;
  // referral_token: string;
  // referred_by_signup_token: string;
  // removed_date: string;
  // removed_priority: number;
  // uuid: string;
  // verified: boolean;
  // answers: {
  //   question_value: string;
  //   optional: boolean;
  //   answer_value: string;
  // }[];
  // phone: string;
  // first_name: string;
  // last_name: string;
  // waitlist_id: number;
}

export class WebhookEventDto {
  @IsEnum(['new_signup', 'offboarded_signup'])
  event: 'new_signup' | 'offboarded_signup';

  @ValidateNested()
  @Type(() => SignupPayload)
  @ApiProperty({
    description: 'Signup data',
  })
  signup: SignupPayload;
}
