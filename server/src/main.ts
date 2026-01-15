import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CamelCaseInterceptor } from './common/interceptors/camel-case.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.CORS_ORIGIN || '*',
    ],
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new CamelCaseInterceptor());

  const port = process.env.PORT || 5000;

  await app.listen(port);
  console.log(`🚀 Job Portal API запущен на порту ${port}`);
  console.log(`📚 Окружение: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
