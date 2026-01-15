import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/db/database.module';
import { JobsModule } from './domains/jobs/jobs.module';
import { ApplicationsModule } from './domains/applications/applications.module';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { AppController } from './gateways/api/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,

    AuthModule,

    UsersModule,

    JobsModule,

    ApplicationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
