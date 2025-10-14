/**
 * Главный модуль приложения
 * Объединяет все остальные модули и настраивает глобальные провайдеры
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Модуль конфигурации для работы с переменными окружения
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigService доступным во всех модулях
      envFilePath: '.env', // Путь к файлу с переменными окружения
    }),

    // Модуль базы данных PostgreSQL
    DatabaseModule,

    // Модуль для работы с вакансиями
    JobsModule,

    // Модуль для работы с заявками на вакансии
    ApplicationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
