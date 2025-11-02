/**
 * Контроллер авторизации
 * Обрабатывает HTTP запросы для регистрации и входа
 */

import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/send-code
   * Отправка SMS кода на телефон
   */
  @Post('send-code')
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto);
  }

  /**
   * POST /auth/verify-code
   * Верификация кода и регистрация/вход
   */
  @Post('verify-code')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    console.log('📥 AuthController.verifyCode - получены данные:', verifyCodeDto);

    try {
      const result = await this.authService.verifyCode(verifyCodeDto);
      console.log('✅ AuthController.verifyCode - возвращаем результат:', {
        hasToken: !!result.access_token,
        tokenLength: result.access_token?.length,
        hasUser: !!result.user,
        userName: result.user?.name
      });
      return result;
    } catch (error) {
      console.error('❌ AuthController.verifyCode - ошибка:', error.message);
      throw error;
    }
  }

  /**
   * GET /auth/profile
   * Получение профиля текущего пользователя (требует авторизации)
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
