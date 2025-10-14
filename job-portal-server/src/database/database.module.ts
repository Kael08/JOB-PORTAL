/**
 * Модуль для управления подключением к базе данных PostgreSQL
 * Использует пул соединений для оптимальной работы с БД
 */

import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { getDatabaseConfig } from '../config/database.config';

/**
 * Токен для инъекции пула соединений БД
 */
export const DATABASE_POOL = 'DATABASE_POOL';

@Global() // Делаем модуль глобальным, чтобы не импортировать его в каждый модуль
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: async (configService: ConfigService) => {
        // Получаем настройки БД из конфигурации
        const dbConfig = getDatabaseConfig(configService);

        // Создаем пул соединений с PostgreSQL
        const pool = new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          user: dbConfig.user,
          password: dbConfig.password,
          // Настройки пула для оптимальной производительности
          max: 20, // Максимальное количество соединений в пуле
          idleTimeoutMillis: 30000, // Время до закрытия простаивающего соединения
          connectionTimeoutMillis: 2000, // Тайм-аут подключения
        });

        // Обработка ошибок пула
        pool.on('error', (err) => {
          console.error('Неожиданная ошибка клиента БД:', err);
        });

        return pool;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_POOL], // Экспортируем пул для использования в других модулях
})
export class DatabaseModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  /**
   * Проверка подключения к БД при инициализации модуля
   */
  async onModuleInit() {
    const dbConfig = getDatabaseConfig(this.configService);
    const pool = new Pool(dbConfig);

    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Успешное подключение к PostgreSQL БД:', result.rows[0].now);
      await pool.end();
    } catch (error) {
      console.error('❌ Ошибка подключения к PostgreSQL БД:', error);
      throw error;
    }
  }
}
