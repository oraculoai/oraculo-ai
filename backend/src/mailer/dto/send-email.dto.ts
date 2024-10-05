import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EmailRecipient {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class SendEmailDto {
  @ValidateNested()
  @Type(() => EmailRecipient)
  recipients: EmailRecipient[];

  @IsString()
  subject: string;

  @IsString()
  message: string;
}
