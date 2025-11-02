/**
 * Сущность пользователя (User)
 * Описывает структуру данных пользователя в PostgreSQL
 */

export enum UserRole {
  JOB_SEEKER = 'job_seeker',  // Искатель работы
  EMPLOYER = 'employer',      // Работодатель
}

export class User {
  /** Уникальный идентификатор пользователя */
  id: number;

  /** Номер телефона (уникальный) */
  phone: string;

  /** Имя пользователя */
  name: string;

  /** Роль пользователя */
  role: UserRole;

  /** Код верификации для SMS (временный) */
  verificationCode?: string;

  /** Время истечения кода верификации */
  verificationCodeExpires?: Date;

  /** Дата создания записи */
  createdAt?: Date;

  /** Дата последнего обновления */
  updatedAt?: Date;
}
