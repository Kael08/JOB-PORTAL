/**
 * DTO для отправки SMS кода
 */

import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendCodeDto {
  @IsNotEmpty({ message: 'Номер телефона обязателен' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Неверный формат номера телефона. Используйте международный формат, например: +79991234567',
  })
  phone: string;
}
