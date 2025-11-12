/**
 * Глобальный фильтр исключений
 * Перехватывает все HTTP исключения и форматирует их для клиента
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Обрабатывает перехваченное исключение и отправляет форматированный ответ
   * @param exception - Перехваченное исключение
   * @param host - Контекст выполнения
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Определяем статус код и сообщение ошибки
    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      // Обработка HTTP исключений NestJS
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Произошла ошибка';
    } else {
      // Обработка других типов ошибок
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Внутренняя ошибка сервера';

      // Логируем неожиданные ошибки для отладки
      console.error('Неожиданная ошибка:', exception);
    }

    // Формируем единообразный ответ об ошибке
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    // Отправляем ответ клиенту
    response.status(status).json(errorResponse);
  }
}
