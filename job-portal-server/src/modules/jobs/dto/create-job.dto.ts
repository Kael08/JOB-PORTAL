/**
 * DTO (Data Transfer Object) для создания новой вакансии
 * Определяет структуру и правила валидации входящих данных
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateJobDto {
  /** Название вакансии (обязательное) */
  @IsString({ message: 'Название вакансии должно быть строкой' })
  @IsNotEmpty({ message: 'Название вакансии обязательно' })
  jobTitle: string;

  /** Название компании (обязательное) */
  @IsString({ message: 'Название компании должно быть строкой' })
  @IsNotEmpty({ message: 'Название компании обязательно' })
  companyName: string;

  /** URL логотипа компании (необязательное) */
  @IsString({ message: 'Логотип компании должен быть строкой' })
  @IsOptional()
  companyLogo?: string;

  /** Минимальная зарплата (необязательное) */
  @IsString()
  @IsOptional()
  minPrice?: string;

  /** Максимальная зарплата (необязательное) */
  @IsString()
  @IsOptional()
  maxPrice?: string;

  /** Тип зарплаты (необязательное) */
  @IsString()
  @IsOptional()
  salaryType?: string;

  /** Местоположение работы (необязательное) */
  @IsString()
  @IsOptional()
  jobLocation?: string;

  /** Дата публикации (необязательное) */
  @IsDateString({}, { message: 'Неверный формат даты' })
  @IsOptional()
  postingDate?: string;

  /** Уровень опыта (необязательное) */
  @IsString()
  @IsOptional()
  experienceLevel?: string;

  /** Тип занятости (необязательное) */
  @IsString()
  @IsOptional()
  employmentType?: string;

  /** Описание вакансии (необязательное) */
  @IsString()
  @IsOptional()
  description?: string;

  /** Email пользователя, публикующего вакансию (обязательное) */
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен' })
  postedBy: string;

  /** Контактный телефон (российский формат, необязательное) */
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsOptional()
  @Matches(/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, {
    message: 'Неверный формат российского номера телефона',
  })
  phone?: string;

  /** Массив необходимых навыков (необязательное) */
  @IsArray({ message: 'Навыки должны быть массивом' })
  @IsOptional()
  skills?: Array<string | { value: string; label?: string }>;
}
