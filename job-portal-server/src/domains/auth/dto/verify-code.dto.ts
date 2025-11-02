/**
 * DTO для верификации SMS кода и регистрации/входа
 */

import { IsNotEmpty, IsString, IsEnum, Matches, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class VerifyCodeDto {
  @IsNotEmpty({ message: 'Номер телефона обязателен' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Неверный формат номера телефона',
  })
  phone: string;

  @IsNotEmpty({ message: 'Код верификации обязателен' })
  @IsString()
  @MinLength(4, { message: 'Код должен содержать минимум 4 символа' })
  code: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Роль должна быть job_seeker или employer' })
  role?: UserRole;
}
