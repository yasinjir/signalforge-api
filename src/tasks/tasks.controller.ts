import { Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('generate')
  generate(@Param('projectId') projectId: string) {
    return this.tasksService.generate(projectId);
  }

  @Get('latest')
  findLatest(@Param('projectId') projectId: string) {
    return this.tasksService.findLatest(projectId);
  }
}