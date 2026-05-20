import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePrdDto } from './dto/update-prd.dto';

@Injectable()
export class PrdService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const latestReport = await this.prisma.reportRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestReport) {
      throw new NotFoundException('No report run found for this project');
    }

    const prd = await this.prisma.prdRun.create({
      data: {
        projectId,
        status: 'completed',
        problemStatement:
          'Users encounter friction across the match experience, especially when joining matches, understanding match state, finding sessions, and relying on reminders. These problems reduce confidence and increase effort in core product flows.',
        goalsText:
          '- Reduce friction in the match join flow\n- Improve reliability and clarity of reminders\n- Make upcoming and past sessions easier to access\n- Improve search relevance and filtering',
        targetUsersText:
          '- Active players joining matches regularly\n- Users rescheduling or tracking upcoming sessions\n- Users searching for players or relevant matches',
        scopeText:
          '- Match join flow simplification\n- Reminder timing improvements\n- Session visibility improvements\n- Better search filters',
        nonGoalsText:
          '- Full redesign of the entire match ecosystem\n- New social features\n- Large-scale ranking system changes',
        successMetricsText:
          '- Reduction in join-flow drop-off\n- Increase in successful match joins\n- Improvement in reminder engagement\n- Increase in session view usage\n- Increase in filtered search usage',
        risksText:
          '- Improvements may span multiple surfaces in the product\n- Reminder improvements may depend on technical delivery constraints\n- Search/filter improvements may require additional data quality work',
        openQuestionsText:
          '- Should reminder improvements be product-only or include infrastructure changes?\n- Should session visibility live in one hub or multiple surfaces?\n- What is the minimum viable improvement for confirmation clarity?',
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'PRD',
        status: 'prd_generated',
      },
    });

    return prd;
  }

  async findLatest(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const prd = await this.prisma.prdRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!prd) {
      throw new NotFoundException('No PRD run found for this project');
    }

    return prd;
  }

  async updateLatest(projectId: string, input: UpdatePrdDto, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const latestPrd = await this.prisma.prdRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestPrd) {
      throw new NotFoundException('No PRD run found for this project');
    }

    return this.prisma.prdRun.update({
      where: { id: latestPrd.id },
      data: input,
    });
  }
}