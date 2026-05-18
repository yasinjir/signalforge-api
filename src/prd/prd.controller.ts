import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdatePrdDto } from './dto/update-prd.dto';
import { PrdService } from './prd.service';

@Controller('projects/:projectId/prd')
export class PrdController {
  constructor(private readonly prdService: PrdService) {}

  @Post('generate')
  generate(@Param('projectId') projectId: string) {
    return this.prdService.generate(projectId);
  }

  @Get('latest')
  findLatest(@Param('projectId') projectId: string) {
    return this.prdService.findLatest(projectId);
  }

  @Patch('latest')
  updateLatest(
    @Param('projectId') projectId: string,
    @Body() body: UpdatePrdDto,
  ) {
    return this.prdService.updateLatest(projectId, body);
  }
}