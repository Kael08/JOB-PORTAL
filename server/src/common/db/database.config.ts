import { ConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export const getDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => ({
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  database: configService.get<string>('DB_NAME', 'job_portal'),
  user: configService.get<string>('DB_USER', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', ''),
});
