import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { InsightsService } from './insights.service';

@UseGuards(SupabaseAuthGuard)
@Controller('projects/:projectId/insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('generate')
  generate(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.insightsService.generate(projectId, user.id);
  }

  @Get('latest')
  findLatest(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.insightsService.findLatest(projectId, user.id);
  }
}
