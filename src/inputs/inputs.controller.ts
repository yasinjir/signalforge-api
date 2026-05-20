import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CreateProjectInputDto } from './dto/create-project-input.dto';
import { InputsService } from './inputs.service';

@UseGuards(SupabaseAuthGuard)
@Controller('projects/:projectId/inputs')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
    @Body() body: CreateProjectInputDto,
  ) {
    return this.inputsService.create(projectId, body, user.id);
  }

  @Get()
  findByProject(
    @CurrentUser() user: AuthUser,
    @Param('projectId') projectId: string,
  ) {
    return this.inputsService.findByProject(projectId, user.id);
  }
}
