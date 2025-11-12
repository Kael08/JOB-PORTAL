/**
 * Сервис для работы с вакансиями
 * Содержит бизнес-логику и взаимодействие с базой данных
 */

import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../common/db/database.module';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  /**
   * Преобразует дату из БД в строку формата YYYY-MM-DD используя локальное время
   * @param dbDate - Дата из БД (может быть Date объект или строка)
   * @returns Строка в формате YYYY-MM-DD
   */
  private formatDateToString(dbDate: any): string {
    if (!dbDate) return null;
    
    if (typeof dbDate === 'string') {
      // Если это строка, берем только дату (до T)
      return dbDate.split('T')[0];
    }
    
    // Если это Date объект, используем локальное время
    const date = new Date(dbDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Преобразует массив вакансий, форматируя даты
   * @param jobs - Массив вакансий из БД
   * @returns Массив вакансий с отформатированными датами
   */
  private formatJobsDates(jobs: any[]): any[] {
    return jobs.map(job => {
      if (job.posting_date) {
        job.posting_date = this.formatDateToString(job.posting_date);
      }
      return job;
    });
  }

  /**
   * Создание новой вакансии
   * @param createJobDto - Данные для создания вакансии
   * @returns Созданная вакансия
   */
  async create(createJobDto: CreateJobDto, userId?: number): Promise<Job> {
    // Преобразуем навыки из формата react-select в массив строк
    const skillsArray = this.normalizeSkills(createJobDto.skills);

    const query = `
      INSERT INTO jobs (
        job_title, company_name, company_logo, min_price, max_price,
        salary_type, city, street, apartment, posting_date, experience_level,
        employment_type, description, posted_by, skills, phone, user_id, is_visible
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::DATE, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      createJobDto.jobTitle,
      createJobDto.companyName,
      createJobDto.companyLogo,
      createJobDto.minPrice,
      createJobDto.maxPrice,
      createJobDto.salaryType,
      createJobDto.city,
      createJobDto.street,
      createJobDto.apartment,
      createJobDto.postingDate,
      createJobDto.experienceLevel,
      createJobDto.employmentType,
      createJobDto.description,
      createJobDto.postedBy,
      skillsArray,
      createJobDto.phone,
      userId,
      true, // is_visible по умолчанию true
    ];

    const result = await this.pool.query(query, values);
    
    // Преобразуем дату обратно в строку формата YYYY-MM-DD для корректного отображения
    if (result.rows[0]?.posting_date) {
      result.rows[0].posting_date = this.formatDateToString(result.rows[0].posting_date);
    }
    
    return result.rows[0];
  }

   /**
   * Получение всех вакансий конкретного пользователя по user_id
   * @param userId - ID пользователя
   * @returns Массив вакансий пользователя
   */
   async findByUserId(userId: number): Promise<Job[]> {
    const query = 'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    const jobs = this.formatJobsDates(result.rows);
    // Убеждаемся, что is_visible присутствует в результате и правильно маппится
    return jobs.map(job => {
      // Если is_visible не определен или null, устанавливаем true по умолчанию
      const isVisible = job.is_visible !== undefined && job.is_visible !== null ? job.is_visible : true;
      // Явно добавляем поле is_visible в результат, чтобы оно точно было в JSON
      return {
        ...job,
        is_visible: isVisible,
        isVisible: isVisible // Также добавляем camelCase версию для совместимости
      };
    });
  }

  /**
   * Получение всех вакансий с сортировкой по дате создания
   * Показывает только видимые вакансии (is_visible = true)
   * @returns Массив всех видимых вакансий
   */
  async findAll(): Promise<Job[]> {
    const query = 'SELECT * FROM jobs WHERE is_visible = true ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return this.formatJobsDates(result.rows);
  }

  /**
   * Получение одной вакансии по ID
   * @param id - ID вакансии
   * @returns Найденная вакансия
   * @throws NotFoundException если вакансия не найдена
   */
  async findOne(id: number): Promise<Job> {
    const query = 'SELECT * FROM jobs WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Вакансия с ID ${id} не найдена`);
    }

    const job = result.rows[0];
    if (job.posting_date) {
      job.posting_date = this.formatDateToString(job.posting_date);
    }
    return job;
  }

  /**
   * Получение всех вакансий конкретного пользователя по email
   * @param email - Email пользователя
   * @returns Массив вакансий пользователя
   */
  async findByEmail(email: string): Promise<Job[]> {
    const query = 'SELECT * FROM jobs WHERE posted_by = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [email]);
    return this.formatJobsDates(result.rows);
  }

  /**
   * Получение всех вакансий конкретного пользователя по email или телефону
   * Ищет совпадение в полях posted_by ИЛИ phone
   * @param identifier - Email или телефон пользователя
   * @returns Массив вакансий пользователя
   */
  async findByIdentifier(identifier: string): Promise<Job[]> {
    const query = 'SELECT * FROM jobs WHERE posted_by = $1 OR phone = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [identifier]);
    return this.formatJobsDates(result.rows);
  }

  /**
   * Обновление вакансии
   * @param id - ID вакансии для обновления
   * @param updateJobDto - Новые данные вакансии
   * @returns Обновленная вакансия
   * @throws NotFoundException если вакансия не найдена
   */
  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    // Преобразуем навыки, если они переданы
    const skillsArray = updateJobDto.skills
      ? this.normalizeSkills(updateJobDto.skills)
      : null;

    const query = `
      UPDATE jobs
      SET job_title = COALESCE($1, job_title),
          company_name = COALESCE($2, company_name),
          company_logo = COALESCE($3, company_logo),
          min_price = COALESCE($4, min_price),
          max_price = COALESCE($5, max_price),
          salary_type = COALESCE($6, salary_type),
          city = COALESCE($7, city),
          street = COALESCE($8, street),
          apartment = COALESCE($9, apartment),
          posting_date = COALESCE($10::DATE, posting_date),
          experience_level = COALESCE($11, experience_level),
          employment_type = COALESCE($12, employment_type),
          description = COALESCE($13, description),
          posted_by = COALESCE($14, posted_by),
          skills = COALESCE($15, skills),
          phone = COALESCE($16, phone)
      WHERE id = $17
      RETURNING *
    `;

    const values = [
      updateJobDto.jobTitle,
      updateJobDto.companyName,
      updateJobDto.companyLogo,
      updateJobDto.minPrice,
      updateJobDto.maxPrice,
      updateJobDto.salaryType,
      updateJobDto.city,
      updateJobDto.street,
      updateJobDto.apartment,
      updateJobDto.postingDate,
      updateJobDto.experienceLevel,
      updateJobDto.employmentType,
      updateJobDto.description,
      updateJobDto.postedBy,
      skillsArray,
      updateJobDto.phone,
      id,
    ];

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Вакансия с ID ${id} не найдена`);
    }

    const job = result.rows[0];
    if (job.posting_date) {
      job.posting_date = this.formatDateToString(job.posting_date);
    }
    return job;
  }

  /**
   * Удаление вакансии
   * @param id - ID вакансии для удаления
   * @returns Удаленная вакансия
   * @throws NotFoundException если вакансия не найдена
   */
  async remove(id: number): Promise<Job> {
    const query = 'DELETE FROM jobs WHERE id = $1 RETURNING *';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Вакансия с ID ${id} не найдена`);
    }

    return result.rows[0];
  }

  /**
   * Вспомогательная функция для нормализации навыков
   * Преобразует навыки из формата react-select в массив строк
   * @param skills - Навыки в различных форматах
   * @returns Массив строк с навыками
   */
  private normalizeSkills(
    skills?: Array<string | { value: string; label?: string }>,
  ): string[] | null {
    if (!skills) return null;

    if (!Array.isArray(skills)) {
      const singleSkill = skills as string | { value: string; label?: string };
      return [typeof singleSkill === 'string' ? singleSkill : singleSkill.value];
    }

    return skills.map((skill) =>
      typeof skill === 'object' && skill !== null ? skill.value : skill as string,
    );
  }

  /**
   * Переключение видимости вакансии (скрыть/показать)
   * @param id - ID вакансии
   * @param userId - ID пользователя (для проверки прав)
   * @returns Обновленная вакансия
   * @throws NotFoundException если вакансия не найдена
   * @throws UnauthorizedException если пользователь не является владельцем вакансии
   */
  async toggleVisibility(id: number, userId: number): Promise<Job> {
    // Сначала проверяем, что вакансия существует и принадлежит пользователю
    const checkQuery = 'SELECT * FROM jobs WHERE id = $1';
    const checkResult = await this.pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      throw new NotFoundException(`Вакансия с ID ${id} не найдена`);
    }

    const job = checkResult.rows[0];
    if (job.user_id !== userId) {
      throw new UnauthorizedException('Вы не можете изменять эту вакансию');
    }

    // Переключаем видимость
    const newVisibility = !job.is_visible;
    const updateQuery = 'UPDATE jobs SET is_visible = $1 WHERE id = $2 RETURNING *';
    const result = await this.pool.query(updateQuery, [newVisibility, id]);

    const updatedJob = result.rows[0];
    if (updatedJob.posting_date) {
      updatedJob.posting_date = this.formatDateToString(updatedJob.posting_date);
    }
    return updatedJob;
  }

  /**
   * Скрытие всех вакансий пользователя
   * @param userId - ID пользователя
   */
  async hideAllUserJobs(userId: number): Promise<void> {
    const query = 'UPDATE jobs SET is_visible = false WHERE user_id = $1';
    await this.pool.query(query, [userId]);
  }
}
