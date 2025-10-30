/**
 * Сервис для работы с вакансиями
 * Содержит бизнес-логику и взаимодействие с базой данных
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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
   * Создание новой вакансии
   * @param createJobDto - Данные для создания вакансии
   * @returns Созданная вакансия
   */
  async create(createJobDto: CreateJobDto): Promise<Job> {
    // Преобразуем навыки из формата react-select в массив строк
    const skillsArray = this.normalizeSkills(createJobDto.skills);

    const query = `
      INSERT INTO jobs (
        job_title, company_name, company_logo, min_price, max_price,
        salary_type, job_location, posting_date, experience_level,
        employment_type, description, posted_by, skills, phone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      createJobDto.jobTitle,
      createJobDto.companyName,
      createJobDto.companyLogo,
      createJobDto.minPrice,
      createJobDto.maxPrice,
      createJobDto.salaryType,
      createJobDto.jobLocation,
      createJobDto.postingDate,
      createJobDto.experienceLevel,
      createJobDto.employmentType,
      createJobDto.description,
      createJobDto.postedBy,
      skillsArray,
      createJobDto.phone,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Получение всех вакансий с сортировкой по дате создания
   * @returns Массив всех вакансий
   */
  async findAll(): Promise<Job[]> {
    const query = 'SELECT * FROM jobs ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows;
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

    return result.rows[0];
  }

  /**
   * Получение всех вакансий конкретного пользователя по email
   * @param email - Email пользователя
   * @returns Массив вакансий пользователя
   */
  async findByEmail(email: string): Promise<Job[]> {
    const query = 'SELECT * FROM jobs WHERE posted_by = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [email]);
    return result.rows;
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
          job_location = COALESCE($7, job_location),
          posting_date = COALESCE($8, posting_date),
          experience_level = COALESCE($9, experience_level),
          employment_type = COALESCE($10, employment_type),
          description = COALESCE($11, description),
          posted_by = COALESCE($12, posted_by),
          skills = COALESCE($13, skills),
          phone = COALESCE($14, phone)
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      updateJobDto.jobTitle,
      updateJobDto.companyName,
      updateJobDto.companyLogo,
      updateJobDto.minPrice,
      updateJobDto.maxPrice,
      updateJobDto.salaryType,
      updateJobDto.jobLocation,
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

    return result.rows[0];
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
}
