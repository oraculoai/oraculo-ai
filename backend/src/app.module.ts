import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProxyModule } from '@/proxy/proxy.module';
import { LandingPageModule } from '@/landing-page/landing-page.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { AiWorkforceModule } from '@/ai-workforce/ai-workforce.module';
import { UserModule } from '@/user/user.module';
import { RequestModule } from '@/request/request.module';
import { GetWaitlistModule } from '@/integration/get-waitlist/get-waitlist.module';

@Module({
  imports: [
    // Prisma
    PrismaModule,

    // Proxy
    ProxyModule,

    // Landing Page
    LandingPageModule,

    // AIWorkforce
    AiWorkforceModule,
    UserModule,
    RequestModule,

    // Integrations
    GetWaitlistModule,

    // Config
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
