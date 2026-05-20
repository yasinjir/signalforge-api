import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { InputsModule } from './inputs/inputs.module';
import { InsightsModule } from './insights/insights.module';
import { ReportsModule } from './reports/reports.module';
import { PrdModule } from './prd/prd.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProjectsModule,
    InputsModule,
    InsightsModule,
    ReportsModule,
    PrdModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
