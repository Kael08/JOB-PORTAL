import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JobsService } from '../jobs/jobs.service';
import { SmsService } from '../../common/services/sms.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jobsService: JobsService,
    private smsService: SmsService,
    private jwtService: JwtService,
  ) {}

  private normalizePhone(phone: string): string {
    let digits = phone.replace(/\D/g, '');

    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    }

    if (digits.startsWith('9') && digits.length === 10) {
      digits = '7' + digits;
    }

    return '+' + digits;
  }

  async sendCode(sendCodeDto: SendCodeDto): Promise<{ message: string; isExistingUser: boolean }> {
    const phone = this.normalizePhone(sendCodeDto.phone);

    console.log('📱 Отправка кода на номер:', phone);

    const existingUser = await this.usersService.findByPhone(phone);
    const isExistingUser = existingUser && existingUser.name !== 'Pending';

    console.log('👤 Пользователь:', existingUser ? `существует (${existingUser.name})` : 'новый');

    const code = this.smsService.generateVerificationCode();

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    console.log('🔐 Сгенерирован код:', code, 'действителен до:', expiresAt);

    await this.usersService.createOrUpdateVerificationCode(phone, code, expiresAt);

    console.log('💾 Код сохранен в БД');

    const sent = await this.smsService.sendVerificationCode(phone, code);

    if (!sent) {
      throw new BadRequestException('Не удалось отправить SMS');
    }

    console.log('✅ SMS отправлено');

    return {
      message: 'Код верификации отправлен на ваш номер телефона',
      isExistingUser,
    };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
    access_token: string;
    user: Omit<User, 'verificationCode' | 'verificationCodeExpires'>;
  }> {
    const { code, name, role } = verifyCodeDto;
    const phone = this.normalizePhone(verifyCodeDto.phone);

    console.log('🔑 Верификация кода:', {
      phone,
      code,
      name: name || 'не указано (существующий пользователь)',
      role: role || 'не указано (существующий пользователь)',
    });

    const user = await this.usersService.verifyCodeAndUpdateUser(phone, code, name, role);

    if (!user) {
      console.error('❌ Верификация не прошла - код неверный или истек');
      throw new UnauthorizedException('Неверный или истекший код верификации');
    }

    console.log('✅ Верификация успешна, пользователь:', user.name);

    const payload = {
      sub: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    console.log('🎫 JWT токен создан:', accessToken.substring(0, 30) + '...', 'длина:', accessToken.length);

    const { verificationCode, verificationCodeExpires, ...userWithoutSensitiveData } = user;

    return {
      access_token: accessToken,
      user: userWithoutSensitiveData,
    };
  }

  async validateUser(userId: number): Promise<Omit<User, 'verificationCode' | 'verificationCodeExpires'> | null> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      return null;
    }

    const { verificationCode, verificationCodeExpires, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  async changeRole(userId: number, newRole: UserRole): Promise<{
    access_token: string;
    user: Omit<User, 'verificationCode' | 'verificationCodeExpires'>;
  }> {
    const currentUser = await this.usersService.findById(userId);
    if (!currentUser) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (currentUser.role === UserRole.EMPLOYER && newRole === UserRole.JOB_SEEKER) {
      await this.jobsService.hideAllUserJobs(userId);
    }

    const updatedUser = await this.usersService.changeRole(userId, newRole);

    const payload = {
      sub: updatedUser.id,
      phone: updatedUser.phone,
      name: updatedUser.name,
      role: updatedUser.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { verificationCode, verificationCodeExpires, ...userWithoutSensitiveData } = updatedUser;

    return {
      access_token: accessToken,
      user: userWithoutSensitiveData,
    };
  }
}
