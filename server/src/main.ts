/**
 * Главная точка входа в приложение NestJS
 * Здесь настраивается сервер, middleware и глобальные конфигурации
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CamelCaseInterceptor } from './common/interceptors/camel-case.interceptor';

async function bootstrap() {
  // Создаем экземпляр приложения NestJS
  const app = await NestFactory.create(AppModule);

  // Настройка CORS для взаимодействия с фронтендом
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.CORS_ORIGIN || '*',
    ],
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Глобальная валидация входящих данных с помощью class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет свойства, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку при лишних полях
      transform: true, // Автоматически преобразует типы данных
    }),
  );

  // Глобальный интерсептор для преобразования snake_case в camelCase
  app.useGlobalInterceptors(new CamelCaseInterceptor());

  // Получаем порт из переменных окружения или используем 5000 по умолчанию
  const port = process.env.PORT || 5000;

  await app.listen(port);
  console.log(`🚀 Job Portal API запущен на порту ${port}`);
  console.log(`📚 Окружение: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
