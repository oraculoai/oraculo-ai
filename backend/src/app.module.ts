import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProxyModule } from './proxy/proxy.module';
import { AIModule } from '@/ai/ai.module';
import { LandingPageModule } from '@/landing-page/landing-page.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { AiWorkforceModule } from './ai-workforce/ai-workforce.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Prisma
    PrismaModule,

    // Proxy
    ProxyModule,

    // Landing Page
    LandingPageModule,

    // AI
    AIModule,

    // Config
    ConfigModule.forRoot(),

    AiWorkforceModule,

    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
