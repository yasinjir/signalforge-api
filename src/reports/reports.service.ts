import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const latestInsight = await this.prisma.insightRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestInsight) {
      throw new NotFoundException('No insight run found for this project');
    }

    const report = await this.prisma.reportRun.create({
      data: {
        projectId,
        status: 'completed',
        executiveSummary:
          'SignalForge identified consistent user friction in the end-to-end match experience. The most urgent issues relate to joining matches, receiving timely reminders, and understanding session status. Secondary opportunities include improving discoverability and search quality.',
        keyFindingsJson: JSON.stringify([
          'The match join flow feels heavier than expected',
          'Notification timing creates reliability issues',
          'Users need stronger visibility into upcoming and past sessions',
          'Search and filtering need more precision',
        ]),
        topProblemsJson: JSON.stringify([
          'Joining a match requires too many steps',
          'Reminder timing is inconsistent',
          'Users cannot easily locate relevant session information',
          'Match state and confirmation are not always obvious',
        ]),
        opportunitiesJson: JSON.stringify([
          'Reduce the number of steps in the join flow',
          'Improve reminder timing logic and visibility',
          'Add a clearer session hub for upcoming and past matches',
          'Improve search filters, especially around skill level',
        ]),
        recommendedFocus:
          'The team should prioritize workflow simplification and reminder reliability first, then improve discoverability and filtering in a second wave.',
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'Report',
        status: 'report_generated',
      },
    });

    return this.formatReport(report);
  }

  async findLatest(projectId: string) {
    const report = await this.prisma.reportRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!report) {
      throw new NotFoundException('No report run found for this project');
    }

    return this.formatReport(report);
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
      keyFindings: JSON.parse(report.keyFindingsJson),
      topProblems: JSON.parse(report.topProblemsJson),
      opportunities: JSON.parse(report.opportunitiesJson),
      recommendedFocus: report.recommendedFocus,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }
}