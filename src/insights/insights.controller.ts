import { Controller, Get, Param, Post } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('projects/:projectId/insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('generate')
  generate(@Param('projectId') projectId: string) {
    return this.insightsService.generate(projectId);
  }

  @Get('latest')
  findLatest(@Param('projectId') projectId: string) {
    return this.insightsService.findLatest(projectId);
  }
}