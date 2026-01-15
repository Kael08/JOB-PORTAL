import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateJobDto {
  @IsString({ message: 'Название вакансии должно быть строкой' })
  @IsNotEmpty({ message: 'Название вакансии обязательно' })
  jobTitle: string;

  @IsString({ message: 'Название компании должно быть строкой' })
  @IsNotEmpty({ message: 'Название компании обязательно' })
  companyName: string;

  @IsString({ message: 'Логотип компании должен быть строкой' })
  @IsOptional()
  companyLogo?: string;

  @IsString()
  @IsOptional()
  minPrice?: string;

  @IsString()
  @IsOptional()
  maxPrice?: string;

  @IsString()
  @IsOptional()
  salaryType?: string;

  @IsString({ message: 'Город должен быть строкой' })
  @IsNotEmpty({ message: 'Город обязателен' })
  city: string;

  @IsString({ message: 'Улица должна быть строкой' })
  @IsNotEmpty({ message: 'Улица обязательна' })
  street: string;

  @IsString({ message: 'Номер апартамента должен быть строкой' })
  @IsNotEmpty({ message: 'Номер апартамента обязателен' })
  apartment: string;

  @IsDateString({}, { message: 'Неверный формат даты' })
  @IsOptional()
  postingDate?: string;

  @IsString()
  @IsOptional()
  experienceLevel?: string;

  @IsString()
  @IsOptional()
  employmentType?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен' })
  postedBy: string;

  @IsString({ message: 'Телефон должен быть строкой' })
  @IsOptional()
  phone?: string;

  @IsArray({ message: 'Навыки должны быть массивом' })
  @IsOptional()
  skills?: Array<string | { value: string; label?: string }>;
}
