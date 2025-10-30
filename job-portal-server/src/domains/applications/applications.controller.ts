/**
 * Контроллер для работы с заявками на вакансии
 * Обрабатывает HTTP запросы, связанные с подачей и просмотром заявок
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('job')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Подача заявки на вакансию
   * POST /job/:id/apply
   * @param jobId - ID вакансии
   * @param createApplicationDto - Данные заявки (ссылка на резюме)
   * @returns Созданная заявка с сообщением об успехе
   */
  @Post(':id/apply')
  @HttpCode(HttpStatus.OK)
  async apply(
    @Param('id', ParseIntPipe) jobId: number,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    const application = await this.applicationsService.create(
      jobId,
      createApplicationDto,
    );

    return {
      message: 'Заявка успешно отправлена!',
      application,
    };
  }

  /**
   * Получение всех заявок для конкретной вакансии
   * GET /job/:id/applications
   * @param jobId - ID вакансии
   * @returns Массив заявок на вакансию
   */
  @Get(':id/applications')
  async findByJobId(@Param('id', ParseIntPipe) jobId: number) {
    return this.applicationsService.findByJobId(jobId);
  }
}
