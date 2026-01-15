import { Controller, Post, Body, Get, Patch, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto);
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-role/:newRole')
  async changeRole(@Request() req, @Param('newRole') newRole: string) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('Пользователь не авторизован');
    }

    if (newRole !== UserRole.JOB_SEEKER && newRole !== UserRole.EMPLOYER) {
      throw new Error('Неверная роль. Допустимые значения: job_seeker, employer');
    }

    return this.authService.changeRole(userId, newRole as UserRole);
  }
}
