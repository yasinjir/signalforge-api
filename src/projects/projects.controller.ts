import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(SupabaseAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: CreateProjectDto) {
    return this.projectsService.create(body, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: ListProjectsQueryDto,
  ) {
    return this.projectsService.findAll(user.id, query);
  }

  @Get(':id/workspace')
  findWorkspace(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.projectsService.findWorkspace(id, user.id);
  }

  @Patch(':id/archive')
  archive(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.projectsService.archive(id, user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.projectsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user.id, body);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.projectsService.remove(id, user.id);
  }
}
