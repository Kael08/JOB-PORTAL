import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../common/db/database.module';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  async findByPhone(phone: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await this.pool.query(query, [phone]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async create(phone: string, name: string, role: UserRole): Promise<User> {
    const query = `
      INSERT INTO users (phone, name, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this.pool.query(query, [phone, name, role]);
    return result.rows[0];
  }

  async saveVerificationCode(phone: string, code: string, expiresAt: Date): Promise<void> {
    const query = `
      UPDATE users
      SET verification_code = $1,
          verification_code_expires = $2
      WHERE phone = $3
    `;
    await this.pool.query(query, [code, expiresAt, phone]);
  }

  async createOrUpdateVerificationCode(phone: string, code: string, expiresAt: Date): Promise<void> {
    const existingUser = await this.findByPhone(phone);

    if (existingUser) {
      await this.saveVerificationCode(phone, code, expiresAt);
    } else {
      const query = `
        INSERT INTO users (phone, name, role, verification_code, verification_code_expires)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (phone)
        DO UPDATE SET
          verification_code = $4,
          verification_code_expires = $5
      `;
      await this.pool.query(query, [phone, 'Pending', 'job_seeker', code, expiresAt]);
    }
  }

  async verifyCodeAndUpdateUser(
    phone: string,
    code: string,
    name?: string,
    role?: UserRole,
  ): Promise<User | null> {
    const now = new Date();
    console.log('🔍 Проверка кода в БД:', { phone, code, текущееВремя: now });

    const checkQuery = `
      SELECT * FROM users
      WHERE phone = $1
        AND verification_code = $2
        AND verification_code_expires > $3
    `;
    const checkResult = await this.pool.query(checkQuery, [phone, code, now]);

    if (checkResult.rows.length === 0) {
      const debugQuery = `SELECT phone, verification_code, verification_code_expires FROM users WHERE phone = $1`;
      const debugResult = await this.pool.query(debugQuery, [phone]);

      if (debugResult.rows.length > 0) {
        const userData = debugResult.rows[0];
        const expiresDate = new Date(userData.verification_code_expires);
        console.error('❌ Код не прошел проверку:', {
          сохраненныйКод: userData.verification_code,
          введенныйКод: code,
          типыКодов: `saved: ${typeof userData.verification_code}, input: ${typeof code}`,
          длинаКодов: `saved: ${userData.verification_code?.length}, input: ${code?.length}`,
          истекает: expiresDate.toISOString(),
          текущееВремя: now.toISOString(),
          разницаМинут: Math.round((expiresDate.getTime() - now.getTime()) / 1000 / 60),
          кодСовпадает: userData.verification_code === code,
          кодНеИстек: expiresDate > now,
        });
      } else {
        console.error('❌ Пользователь не найден в БД:', phone);
      }
      return null;
    }

    const user = checkResult.rows[0];
    console.log('✅ Код верный, пользователь найден:', user.name);

    let updateQuery: string;
    let params: any[];

    if (user.name === 'Pending') {
      console.log('📝 Новый пользователь, обновляем имя и роль');
      if (!name || !role) {
        throw new Error('Имя и роль обязательны для новых пользователей');
      }
      updateQuery = `
        UPDATE users
        SET name = $1,
            role = $2,
            verification_code = NULL,
            verification_code_expires = NULL
        WHERE phone = $3
        RETURNING *
      `;
      params = [name, role, phone];
    } else {
      console.log('👤 Существующий пользователь, только очищаем код');
      updateQuery = `
        UPDATE users
        SET verification_code = NULL,
            verification_code_expires = NULL
        WHERE phone = $1
        RETURNING *
      `;
      params = [phone];
    }

    const result = await this.pool.query(updateQuery, params);
    console.log('✅ Пользователь обновлен');
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async clearVerificationCode(phone: string): Promise<void> {
    const query = `
      UPDATE users
      SET verification_code = NULL,
          verification_code_expires = NULL
      WHERE phone = $1
    `;
    await this.pool.query(query, [phone]);
  }

  async changeRole(userId: number, newRole: UserRole): Promise<User> {
    const query = `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [newRole, userId]);
    if (result.rows.length === 0) {
      throw new Error('Пользователь не найден');
    }
    return result.rows[0];
  }
}
