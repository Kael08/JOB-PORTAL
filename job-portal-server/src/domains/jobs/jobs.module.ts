/**
 * Модуль вакансий
 * Объединяет контроллер и сервис для работы с вакансиями
 */

import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService], // Экспортируем сервис для использования в других модулях
})
export class JobsModule {}
