import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { getDatabaseConfig } from './database.config';

export const DATABASE_POOL = 'DATABASE_POOL';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: async (configService: ConfigService) => {
        const dbConfig = getDatabaseConfig(configService);

        const pool = new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          user: dbConfig.user,
          password: dbConfig.password,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });

        pool.on('error', (err) => {
          console.error('Неожиданная ошибка клиента БД:', err);
        });

        return pool;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

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
