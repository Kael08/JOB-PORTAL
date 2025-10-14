/**
 * DTO для обновления существующей вакансии
 * Все поля необязательные, так как обновляться может любое подмножество полей
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

/**
 * PartialType делает все поля из CreateJobDto необязательными
 * Это позволяет обновлять только те поля, которые передаются в запросе
 */
export class UpdateJobDto extends PartialType(CreateJobDto) {}
