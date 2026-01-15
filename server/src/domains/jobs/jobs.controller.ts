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

  @Post('post-job')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  async create(@Body() createJobDto: CreateJobDto, @Request() req) {
    const userId = req.user?.id;
    const job = await this.jobsService.create(createJobDto, userId);
    
    return {
      message: 'Вакансия успешно опубликована',
      job,
    };
  }

  @Get('myJobs')
  @UseGuards(JwtAuthGuard)
  async findMyJobs(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.jobsService.findByUserId(userId);
  }

  @Get('all-jobs')
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get('all-jobs/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @Get('myJobs/:identifier')
  async findByIdentifier(@Param('identifier') identifier: string) {
    return this.jobsService.findByIdentifier(identifier);
  }

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

  @Patch('job/:id/toggle-visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  async toggleVisibility(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    const job = await this.jobsService.toggleVisibility(id, userId);
    const jobData = job as any;
    return {
      message: jobData.is_visible ? 'Вакансия успешно опубликована' : 'Вакансия успешно скрыта',
      job,
    };
  }
}
