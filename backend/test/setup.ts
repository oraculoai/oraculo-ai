import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { execSync } from 'child_process';

export let app: NestExpressApplication;
const PORT = process.env.PORT || 3333;

async function initServer(): Promise<void> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);
}
global.beforeAll(async () => {
  execSync('npm run prisma:reset');
  await initServer();
}, 30_000);
