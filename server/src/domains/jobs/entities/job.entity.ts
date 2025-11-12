/**
 * Сущность вакансии (Job)
 * Описывает структуру данных вакансии в системе
 */

export class Job {
  /** Уникальный идентификатор вакансии */
  id: number;

  /** Название вакансии */
  jobTitle: string;

  /** Название компании */
  companyName: string;

  /** URL логотипа компании */
  companyLogo?: string;

  /** Минимальная зарплата */
  minPrice?: string;

  /** Максимальная зарплата */
  maxPrice?: string;

  /** Тип зарплаты (почасовая, месячная, годовая) */
  salaryType?: string;

  /** Город */
  city: string;

  /** Улица */
  street: string;

  /** Номер апартамента */
  apartment: string;

  /** Дата публикации вакансии */
  postingDate?: Date;

  /** Уровень опыта (Junior, Middle, Senior) */
  experienceLevel?: string;

  /** Тип занятости (полная, частичная, удаленная) */
  employmentType?: string;

  /** Описание вакансии */
  description?: string;

  /** Email пользователя, опубликовавшего вакансию */
  postedBy: string;

  /** ID пользователя, создавшего вакансию */
  userId?: number;

  /** Контактный телефон для связи по вакансии */
  phone?: string;

  /** Массив необходимых навыков */
  skills?: string[];

  /** Дата создания записи */
  createdAt?: Date;

  /** Совместимость с MongoDB: дублирует id как _id */
  _id?: number;

  /** Видимость вакансии (скрыта или показана) */
  isVisible?: boolean;
}
