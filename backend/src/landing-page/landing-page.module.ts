import { Module } from '@nestjs/common';
import { LandingPageController } from './landing-page.controller';
import { LandingPageService } from './landing-page.service';
import { ProxyModule } from '@/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [LandingPageController],
  providers: [LandingPageService],
})
export class LandingPageModule {}
