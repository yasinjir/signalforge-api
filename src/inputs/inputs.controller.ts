import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProjectInputDto } from './dto/create-project-input.dto';
import { InputsService } from './inputs.service';

@Controller('projects/:projectId/inputs')
export class InputsController {
  constructor(private readonly inputsService: InputsService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() body: CreateProjectInputDto,
  ) {
    return this.inputsService.create(projectId, body);
  }

  @Get()
  findByProject(@Param('projectId') projectId: string) {
    return this.inputsService.findByProject(projectId);
  }
}