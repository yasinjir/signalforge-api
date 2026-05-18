import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CreateProjectInput = {
  name: string;
  initiative?: string;
  backgroundContext?: string;
  analysisGoal?: string;
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateProjectInput) {
    return this.prisma.project.create({
      data: {
        name: input.name,
        initiative: input.initiative,
        backgroundContext: input.backgroundContext,
        analysisGoal: input.analysisGoal,
        currentStage: 'Project',
        status: 'draft',
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }
}