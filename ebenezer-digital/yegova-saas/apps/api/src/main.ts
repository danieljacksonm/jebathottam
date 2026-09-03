import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: (
      process.env.CORS_ORIGINS ||
      "https://saas.ebenezerdigital.com,http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
    )
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true,
  });
  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  console.log(`Ebenezer API running on http://localhost:${port}`);
}
bootstrap();
