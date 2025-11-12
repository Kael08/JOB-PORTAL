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
  UseGuards,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Создание новой вакансии
   * POST /post-job
   * Требует авторизации и роли EMPLOYER
   * @param createJobDto - Данные для создания вакансии
   * @returns Созданная вакансия с сообщением об успехе
   */
  @Post('post-job')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  async create(@Body() createJobDto: CreateJobDto, @Request() req) {
    // Получаем userId из JWT токена (req.user устанавливается JwtAuthGuard)
    const userId = req.user?.id;
    const job = await this.jobsService.create(createJobDto, userId);
    
    return {
      message: 'Вакансия успешно опубликована',
      job,
    };
  }

  /**
   * Получение вакансий текущего авторизованного пользователя
   * GET /myJobs
   * Требует авторизации
   * @returns Массив вакансий пользователя
   */
  @Get('myJobs')
  @UseGuards(JwtAuthGuard)
  async findMyJobs(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.jobsService.findByUserId(userId);
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
   * Получение вакансий конкретного пользователя по email или телефону
   * GET /myJobs/:identifier
   * @param identifier - Email или телефон пользователя
   * @returns Массив вакансий пользователя
   */
  @Get('myJobs/:identifier')
  async findByIdentifier(@Param('identifier') identifier: string) {
    return this.jobsService.findByIdentifier(identifier);
  }

  /**
   * Обновление вакансии
   * PATCH /update-job/:id
   * Требует авторизации и роли EMPLOYER
   * @param id - ID вакансии для обновления
   * @param updateJobDto - Новые данные вакансии
   * @returns Обновленная вакансия с сообщением об успехе
   */
  @Patch('update-job/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
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
   * Требует авторизации и роли EMPLOYER
   * @param id - ID вакансии для удаления
   * @returns Сообщение об успешном удалении
   */
  @Delete('job/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedJob = await this.jobsService.remove(id);
    return {
      message: 'Вакансия успешно удалена',
      deletedJob,
    };
  }
}
