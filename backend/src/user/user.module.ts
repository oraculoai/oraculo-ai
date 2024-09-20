import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GetWaitlistModule } from '@/integration/get-waitlist/get-waitlist.module';

@Module({
  imports: [GetWaitlistModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
