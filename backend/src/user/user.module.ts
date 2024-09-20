import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GetWaitlistModule } from '@/integration/get-waitlist/get-waitlist.module';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
  imports: [GetWaitlistModule, MailerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
