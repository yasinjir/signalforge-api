import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInputDto } from './dto/create-project-input.dto';

@Injectable()
export class InputsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    input: CreateProjectInputDto,
    ownerId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const createdInput = await this.prisma.projectInput.create({
      data: {
        projectId,
        inputType: input.inputType ?? 'raw_text',
        title: input.title,
        contentText: input.contentText,
        contentJson: input.contentJson,
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'Inputs',
        status: 'input_added',
      },
    });

    return createdInput;
  }

  async findByProject(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projectInput.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
