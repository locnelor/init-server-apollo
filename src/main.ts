import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger:
  });
  const configService: ConfigService = app.get(ConfigService)
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true
  })

  app.use(json({ limit: "50mb" }))

  app.useGlobalPipes(new ValidationPipe)
  // set prefix
  // app.setGlobalPrefix("/api")

  app.useStaticAssets('build');
  app.useStaticAssets('resource');
  app.useStaticAssets('public');

  const options = new DocumentBuilder()
    .setTitle(configService.get("TITLE"))
    .setDescription(configService.get("DESCRIPTION"))
    .setVersion(configService.get("VERSION"))
    .build()
  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('docs', app, document);
  app.listen(configService.get("PORT"))
}
bootstrap();
