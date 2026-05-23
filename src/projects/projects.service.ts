import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

type CreateProjectInput = {
  name: string;
  initiative?: string;
  backgroundContext?: string;
  analysisGoal?: string;
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateProjectInput, ownerId: string) {
    return this.prisma.project.create({
      data: {
        ownerId,
        name: input.name,
        initiative: input.initiative,
        backgroundContext: input.backgroundContext,
        analysisGoal: input.analysisGoal,
        currentStage: 'Project',
        status: 'draft',
      },
    });
  }

  findAll(ownerId: string, query: ListProjectsQueryDto = {}) {
    const { search, stage, status, includeArchived } = query;
    const includeArchivedProjects = includeArchived === 'true';

    const where: Prisma.ProjectWhereInput = {
      ownerId,
      ...(includeArchivedProjects ? {} : { status: { not: 'archived' } }),
      ...(stage ? { currentStage: stage } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { initiative: { contains: search, mode: 'insensitive' } },
              { backgroundContext: { contains: search, mode: 'insensitive' } },
              { analysisGoal: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.project.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    return this.findOwnedOrThrow(id, ownerId);
  }

  async update(id: string, ownerId: string, input: UpdateProjectDto) {
    await this.findOwnedOrThrow(id, ownerId);

    const data: Prisma.ProjectUpdateInput = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.initiative !== undefined) {
      data.initiative = input.initiative;
    }
    if (input.backgroundContext !== undefined) {
      data.backgroundContext = input.backgroundContext;
    }
    if (input.analysisGoal !== undefined) {
      data.analysisGoal = input.analysisGoal;
    }
    if (input.status !== undefined) {
      data.status = input.status;
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async archive(id: string, ownerId: string) {
    await this.findOwnedOrThrow(id, ownerId);

    return this.prisma.project.update({
      where: { id },
      data: { status: 'archived' },
    });
  }

  async remove(id: string, ownerId: string) {
    await this.findOwnedOrThrow(id, ownerId);

    await this.prisma.project.delete({
      where: { id },
    });

    return { deleted: true, id };
  }

  private async findOwnedOrThrow(id: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, ownerId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findWorkspace(id: string, ownerId: string) {
    const project = await this.findOwnedOrThrow(id, ownerId);

    const [inputs, latestInsight, latestReport, latestPrd, latestTaskRun] =
      await Promise.all([
        this.prisma.projectInput.findMany({
          where: { projectId: id },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.insightRun.findFirst({
          where: { projectId: id },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.reportRun.findFirst({
          where: { projectId: id },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.prdRun.findFirst({
          where: { projectId: id },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.taskRun.findFirst({
          where: { projectId: id },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    return {
      project,
      inputs,
      latestInsight: latestInsight ? this.formatInsight(latestInsight) : null,
      latestReport: latestReport ? this.formatReport(latestReport) : null,
      latestPrd: latestPrd ?? null,
      latestTasks: latestTaskRun ? this.formatTaskRun(latestTaskRun) : null,
    };
  }

  private safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
    if (value == null || value === '') {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  private formatInsight(insight: {
    id: string;
    projectId: string;
    status: string;
    summary: string;
    themesJson: string;
    painPointsJson: string;
    featureRequestsJson: string;
    repeatedSignalsJson: string;
    priorityCuesJson: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: insight.id,
      projectId: insight.projectId,
      status: insight.status,
      summary: insight.summary,
      themes: this.safeJsonParse(insight.themesJson, []),
      painPoints: this.safeJsonParse(insight.painPointsJson, []),
      featureRequests: this.safeJsonParse(insight.featureRequestsJson, []),
      repeatedSignals: this.safeJsonParse(insight.repeatedSignalsJson, []),
      priorityCues: this.safeJsonParse(insight.priorityCuesJson, []),
      createdAt: insight.createdAt,
      updatedAt: insight.updatedAt,
    };
  }

  private formatReport(report: {
    id: string;
    projectId: string;
    status: string;
    executiveSummary: string;
    keyFindingsJson: string;
    topProblemsJson: string;
    opportunitiesJson: string;
    recommendedFocus: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: report.id,
      projectId: report.projectId,
      status: report.status,
      executiveSummary: report.executiveSummary,
      keyFindings: this.safeJsonParse(report.keyFindingsJson, []),
      topProblems: this.safeJsonParse(report.topProblemsJson, []),
      opportunities: this.safeJsonParse(report.opportunitiesJson, []),
      recommendedFocus: report.recommendedFocus,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }

  private formatTaskRun(taskRun: {
    id: string;
    projectId: string;
    status: string;
    workBucketsJson: string;
    tasksJson: string;
    userStoriesJson: string;
    acceptanceCriteriaJson: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: taskRun.id,
      projectId: taskRun.projectId,
      status: taskRun.status,
      workBuckets: this.safeJsonParse(taskRun.workBucketsJson, []),
      tasks: this.safeJsonParse(taskRun.tasksJson, []),
      userStories: this.safeJsonParse(taskRun.userStoriesJson, []),
      acceptanceCriteria: this.safeJsonParse(
        taskRun.acceptanceCriteriaJson,
        [],
      ),
      createdAt: taskRun.createdAt,
      updatedAt: taskRun.updatedAt,
    };
  }
}
