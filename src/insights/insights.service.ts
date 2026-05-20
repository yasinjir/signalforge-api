import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
      include: {
        inputs: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.inputs.length === 0) {
      throw new BadRequestException('Project has no inputs to analyze');
    }

    const insight = await this.prisma.insightRun.create({
      data: {
        projectId,
        status: 'completed',
        summary:
          'Users see value in the experience, but the current flow creates friction in discoverability, joining, scheduling, and reminders. The strongest opportunities are simplifying the join flow, improving reminder timing, and making sessions easier to find and manage.',
        themesJson: JSON.stringify([
          'Navigation and discoverability',
          'Match join flow',
          'Scheduling and rescheduling',
          'Notifications and reminder timing',
          'Search and filtering',
        ]),
        painPointsJson: JSON.stringify([
          'Users struggle to find past and upcoming sessions',
          'Joining a match feels too complex',
          'Reminder timing is unreliable or too late',
          'Match confirmation is not always clear',
          'Search filters are not specific enough',
        ]),
        featureRequestsJson: JSON.stringify([
          'Easier rescheduling',
          'Better player filters',
          'Central view for upcoming matches',
          'Clearer match confirmation state',
          'Improved reminder timing',
        ]),
        repeatedSignalsJson: JSON.stringify([
          'Join flow complexity',
          'Reminder timing issues',
          'Session discoverability',
          'Search filtering limitations',
        ]),
        priorityCuesJson: JSON.stringify([
          { level: 'High', text: 'Simplify match join flow' },
          {
            level: 'High',
            text: 'Improve reminder timing and confirmation clarity',
          },
          { level: 'Medium', text: 'Improve session discoverability' },
          { level: 'Medium', text: 'Improve filtering for player search' },
        ]),
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'Insights',
        status: 'insights_generated',
      },
    });

    return this.formatInsight(insight);
  }

  async findLatest(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const insight = await this.prisma.insightRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!insight) {
      throw new NotFoundException('No insight run found for this project');
    }

    return this.formatInsight(insight);
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
      themes: JSON.parse(insight.themesJson),
      painPoints: JSON.parse(insight.painPointsJson),
      featureRequests: JSON.parse(insight.featureRequestsJson),
      repeatedSignals: JSON.parse(insight.repeatedSignalsJson),
      priorityCues: JSON.parse(insight.priorityCuesJson),
      createdAt: insight.createdAt,
      updatedAt: insight.updatedAt,
    };
  }
}