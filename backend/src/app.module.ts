import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProxyModule } from './proxy/proxy.module';
import { AIModule } from '@/ai/ai.module';
import { LandingPageModule } from '@/landing-page/landing-page.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Proxy
    ProxyModule,

    // Landing Page
    LandingPageModule,

    // AI
    AIModule,

    // Config
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
