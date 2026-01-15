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

  @Get(':id/applications')
  async findByJobId(@Param('id', ParseIntPipe) jobId: number) {
    return this.applicationsService.findByJobId(jobId);
  }
}
