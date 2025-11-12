/**
 * Конфигурация для подключения к базе данных PostgreSQL
 * Используется ConfigService для безопасного доступа к переменным окружения
 */

import { ConfigService } from '@nestjs/config';

/**
 * Интерфейс для настроек базы данных
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/**
 * Получает конфигурацию базы данных из переменных окружения
 * @param configService - Сервис конфигурации NestJS
 * @returns Объект с настройками подключения к БД
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => ({
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  database: configService.get<string>('DB_NAME', 'job_portal'),
  user: configService.get<string>('DB_USER', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', ''),
});
