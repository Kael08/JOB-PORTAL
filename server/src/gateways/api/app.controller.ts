import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): { message: string; timestamp: string } {
    return {
      message: 'Hello Developer! Job Portal API работает на NestJS с PostgreSQL',
      timestamp: new Date().toISOString(),
    };
  }
}
