import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateApplicationDto {
  @IsString({ message: 'Ссылка на резюме должна быть строкой' })
  @IsNotEmpty({ message: 'Ссылка на резюме обязательна' })
  @IsUrl({}, { message: 'Ссылка на резюме должна быть валидным URL' })
  resumeLink: string;
}
