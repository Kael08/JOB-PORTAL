/**
 * Сервис для отправки SMS через SMS.ru
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;
  private readonly testMode: boolean;
  private readonly apiUrl = 'https://sms.ru/sms/send';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SMSRU_API_KEY', '');
    this.testMode = this.configService.get<string>('SMSRU_TEST_MODE') === 'true';
  }

  /**
   * Генерация 4-значного кода верификации
   */
  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Отправка SMS с кодом верификации
   * @param phone - Номер телефона в формате +79991234567
   * @param code - Код верификации
   */
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    const message = `Ваш код подтверждения: ${code}. Никому не сообщайте этот код.`;

    // В тестовом режиме просто логируем код в консоль
    if (this.testMode) {
      this.logger.log(`[TEST MODE] SMS для ${phone}: ${message}`);
      this.logger.warn(`Код верификации для ${phone}: ${code}`);
      return true;
    }

    this.logger.log(`Отправка SMS на ${phone} с API ключом: ${this.apiKey.substring(0, 10)}...`);

    try {
      const params = {
        api_id: this.apiKey,
        to: phone,
        msg: message,
        json: 1,
      };

      this.logger.debug(`Параметры запроса: ${JSON.stringify(params)}`);

      const response = await axios.get(this.apiUrl, { params });

      this.logger.log(`Ответ от SMS.ru: ${JSON.stringify(response.data)}`);

      // SMS.ru возвращает status_code в ответе
      if (response.data.status === 'OK' || response.data.status_code === 100) {
        this.logger.log(`✅ SMS успешно отправлено на ${phone}`);
        return true;
      } else {
        this.logger.error(`❌ Ошибка отправки SMS: ${JSON.stringify(response.data)}`);
        this.logger.error(`Код ошибки: ${response.data.status_code}, текст: ${response.data.status_text}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`❌ Ошибка при отправке SMS: ${error.message}`);
      if (error.response) {
        this.logger.error(`Ответ сервера: ${JSON.stringify(error.response.data)}`);
      }
      throw new Error('Не удалось отправить SMS');
    }
  }
}
