import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UpdatePrdDto } from './dto/update-prd.dto';
import { PrdService } from './prd.service';

@UseGuards(SupabaseAuthGuard)
@Controller('projects/:projectId/prd')
export class PrdController {
  constructor(private readonly prdService: PrdService) {}

  @Post('generate')
  generate(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.prdService.generate(projectId, user.id);
  }

  @Get('latest')
  findLatest(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.prdService.findLatest(projectId, user.id);
  }

  @Patch('latest')
  updateLatest(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Body() body: UpdatePrdDto,
  ) {
    return this.prdService.updateLatest(projectId, body, user.id);
  }
}
