import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../common/db/database.module';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
  ) {}

  async create(
    jobId: number,
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const jobCheck = await this.pool.query(
      'SELECT id FROM jobs WHERE id = $1',
      [jobId],
    );

    if (jobCheck.rows.length === 0) {
      throw new NotFoundException(`Вакансия с ID ${jobId} не найдена`);
    }

    const query = `
      INSERT INTO job_applications (job_id, resume_link)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      jobId,
      createApplicationDto.resumeLink,
    ]);

    return result.rows[0];
  }

  async findByJobId(jobId: number): Promise<Application[]> {
    const query = `
      SELECT * FROM job_applications
      WHERE job_id = $1
      ORDER BY applied_at DESC
    `;

    const result = await this.pool.query(query, [jobId]);
    return result.rows;
  }
}
