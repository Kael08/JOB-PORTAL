/**
 * Модуль заявок на вакансии
 * Объединяет контроллер и сервис для работы с заявками
 */

import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService], // Экспортируем сервис для использования в других модулях
})
export class ApplicationsModule {}
