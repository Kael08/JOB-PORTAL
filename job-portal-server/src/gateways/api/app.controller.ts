/**
 * Главный контроллер приложения
 * Обрабатывает базовые маршруты
 */

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Базовый маршрут для проверки работоспособности API
   * GET /
   */
  @Get()
  getRoot(): { message: string; timestamp: string } {
    return {
      message: 'Hello Developer! Job Portal API работает на NestJS с PostgreSQL',
      timestamp: new Date().toISOString(),
    };
  }
}
