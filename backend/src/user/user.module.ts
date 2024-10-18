import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailerModule } from '@/mailer/mailer.module';
import { WaitlistModule } from '@/waitlist/waitlist.module';

@Module({
  imports: [WaitlistModule, MailerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
