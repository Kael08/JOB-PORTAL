/**
 * Контроллер для работы с вакансиями
 * Обрабатывает HTTP запросы и маршруты, связанные с вакансиями
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Создание новой вакансии
   * POST /post-job
   * @param createJobDto - Данные для создания вакансии
   * @returns Созданная вакансия с сообщением об успехе
   */
  @Post('post-job')
  @HttpCode(HttpStatus.OK)
  async create(@Body() createJobDto: CreateJobDto) {
    const job = await this.jobsService.create(createJobDto);
    return {
      message: 'Вакансия успешно опубликована',
      job,
    };
  }

  /**
   * Получение всех вакансий
   * GET /all-jobs
   * @returns Массив всех вакансий
   */
  @Get('all-jobs')
  async findAll() {
    return this.jobsService.findAll();
  }

  /**
   * Получение одной вакансии по ID
   * GET /all-jobs/:id
   * @param id - ID вакансии
   * @returns Найденная вакансия
   */
  @Get('all-jobs/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  /**
   * Получение вакансий конкретного пользователя по email
   * GET /myJobs/:email
   * @param email - Email пользователя
   * @returns Массив вакансий пользователя
   */
  @Get('myJobs/:email')
  async findByEmail(@Param('email') email: string) {
    return this.jobsService.findByEmail(email);
  }

  /**
   * Обновление вакансии
   * PATCH /update-job/:id
   * @param id - ID вакансии для обновления
   * @param updateJobDto - Новые данные вакансии
   * @returns Обновленная вакансия с сообщением об успехе
   */
  @Patch('update-job/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    const job = await this.jobsService.update(id, updateJobDto);
    return {
      message: 'Вакансия успешно обновлена',
      job,
    };
  }

  /**
   * Удаление вакансии
   * DELETE /job/:id
   * @param id - ID вакансии для удаления
   * @returns Сообщение об успешном удалении
   */
  @Delete('job/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedJob = await this.jobsService.remove(id);
    return {
      message: 'Вакансия успешно удалена',
      deletedJob,
    };
  }
}
