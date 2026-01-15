export class Job {
  id: number;

  jobTitle: string;

  companyName: string;

  companyLogo?: string;

  minPrice?: string;

  maxPrice?: string;

  salaryType?: string;

  city: string;

  street: string;

  apartment: string;

  postingDate?: Date;

  experienceLevel?: string;

  employmentType?: string;

  description?: string;

  postedBy: string;

  userId?: number;

  phone?: string;

  skills?: string[];

  createdAt?: Date;

  _id?: number;

  isVisible?: boolean;
}
