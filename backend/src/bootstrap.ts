import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';
import { Handler } from 'aws-lambda';

const PORT = process.env.PORT || 3333;

export type RunMode = 'main' | 'serverless';

export const CONFIG: { runMode?: RunMode } = {};

export async function bootstrap(runMode: RunMode): Promise<Handler> {
  CONFIG.runMode = runMode;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors();

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Oraculo AI API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  if (runMode === 'main') {
    await app.listen(PORT);
  } else if (runMode === 'serverless') {
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
  }

  Logger.log('Server started on http://localhost:' + PORT);
}
