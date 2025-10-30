/**
 * DTO для создания заявки на вакансию
 * Определяет структуру и правила валидации для подачи заявки
 */

import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateApplicationDto {
  /** Ссылка на резюме кандидата (обязательное, должно быть валидным URL) */
  @IsString({ message: 'Ссылка на резюме должна быть строкой' })
  @IsNotEmpty({ message: 'Ссылка на резюме обязательна' })
  @IsUrl({}, { message: 'Ссылка на резюме должна быть валидным URL' })
  resumeLink: string;
}
