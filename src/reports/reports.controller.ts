import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('projects/:projectId/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  generate(@Param('projectId') projectId: string) {
    return this.reportsService.generate(projectId);
  }

  @Get('latest')
  findLatest(@Param('projectId') projectId: string) {
    return this.reportsService.findLatest(projectId);
  }
}