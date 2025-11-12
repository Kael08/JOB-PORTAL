/**
 * Главный модуль приложения
 * Объединяет все остальные модули и настраивает глобальные провайдеры
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/db/database.module';
import { JobsModule } from './domains/jobs/jobs.module';
import { ApplicationsModule } from './domains/applications/applications.module';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { AppController } from './gateways/api/app.controller';

@Module({
  imports: [
    // Модуль конфигурации для работы с переменными окружения
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigService доступным во всех модулях
      envFilePath: '.env', // Путь к файлу с переменными окружения
    }),

    // Модуль базы данных PostgreSQL
    DatabaseModule,

    // Модуль аутентификации и авторизации
    AuthModule,

    // Модуль пользователей
    UsersModule,

    // Модуль для работы с вакансиями
    JobsModule,

    // Модуль для работы с заявками на вакансии
    ApplicationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
