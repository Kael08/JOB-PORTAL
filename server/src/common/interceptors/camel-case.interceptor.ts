/**
 * Интерсептор для преобразования ответов из snake_case в camelCase
 * Обеспечивает совместимость с фронтендом, который ожидает camelCase
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CamelCaseInterceptor implements NestInterceptor {
  /**
   * Перехватывает ответ и преобразует все ключи объектов в camelCase
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformToCamelCase(data)));
  }

  /**
   * Рекурсивное преобразование ключей объекта из snake_case в camelCase
   * @param data - Данные для преобразования
   * @returns Преобразованные данные
   */
  private transformToCamelCase(data: any): any {
    // Обработка null и undefined
    if (data === null || data === undefined) {
      return data;
    }

    // Обработка массивов - рекурсивно преобразуем каждый элемент
    if (Array.isArray(data)) {
      return data.map((item) => this.transformToCamelCase(item));
    }

    // Обработка объектов
    if (typeof data === 'object' && data.constructor === Object) {
      const camelCaseObj: any = {};

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          // Преобразуем ключ в camelCase
          const camelKey = this.snakeToCamel(key);
          // Рекурсивно преобразуем значение
          camelCaseObj[camelKey] = this.transformToCamelCase(data[key]);

          // Добавляем поле _id для совместимости с MongoDB-подобным API
          if (key === 'id') {
            camelCaseObj._id = data[key];
          }
        }
      }

      return camelCaseObj;
    }

    // Для примитивных типов возвращаем как есть
    return data;
  }

  /**
   * Преобразует строку из snake_case в camelCase
   * @param str - Строка в snake_case
   * @returns Строка в camelCase
   * @example 'job_title' => 'jobTitle'
   */
  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
}
