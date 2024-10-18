import { Module } from '@nestjs/common';
import { AiWorkforceController } from './ai-workforce.controller';
import { AiWorkforceService } from './ai-workforce.service';
import { LangflowModule } from '@/langflow/langflow.module';
import { RequestModule } from '@/request/request.module';
import { MailerModule } from '@/mailer/mailer.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [LangflowModule, RequestModule, MailerModule, UserModule],
  controllers: [AiWorkforceController],
  providers: [AiWorkforceService],
})
export class AiWorkforceModule {}
