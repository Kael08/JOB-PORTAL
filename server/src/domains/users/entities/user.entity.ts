export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
}

export class User {
  id: number;

  phone: string;

  name: string;

  role: UserRole;

  verificationCode?: string;

  verificationCodeExpires?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
