import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
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

    const taskRun = await this.prisma.taskRun.create({
      data: {
        projectId,
        status: 'completed',
        workBucketsJson: JSON.stringify([
          {
            name: 'Match join flow',
            tasks: [
              'Audit current join flow steps',
              'Identify removable or mergeable steps',
              'Propose simplified join interaction',
              'Define success and failure states',
              'Prepare acceptance criteria for streamlined flow',
            ],
          },
          {
            name: 'Reminder and confirmation system',
            tasks: [
              'Audit current reminder timing logic',
              'Define improved reminder timing rules',
              'Add clearer confirmation state messaging',
              'Define reminder edge cases',
              'Prepare acceptance criteria for reminder reliability',
            ],
          },
          {
            name: 'Session visibility',
            tasks: [
              'Design upcoming and past session visibility model',
              'Define information hierarchy for session hub',
              'Clarify where match state should appear',
              'Prepare acceptance criteria for discoverability improvements',
            ],
          },
          {
            name: 'Search and filtering',
            tasks: [
              'Identify current filter limitations',
              'Define new filter fields such as skill level',
              'Improve search result clarity',
              'Prepare acceptance criteria for filter usage',
            ],
          },
        ]),
        tasksJson: JSON.stringify([
          'Audit current join flow steps',
          'Identify removable or mergeable steps',
          'Propose simplified join interaction',
          'Define success and failure states',
          'Prepare acceptance criteria for streamlined flow',
          'Audit current reminder timing logic',
          'Define improved reminder timing rules',
          'Add clearer confirmation state messaging',
          'Define reminder edge cases',
          'Prepare acceptance criteria for reminder reliability',
          'Design upcoming and past session visibility model',
          'Define information hierarchy for session hub',
          'Clarify where match state should appear',
          'Prepare acceptance criteria for discoverability improvements',
          'Identify current filter limitations',
          'Define new filter fields such as skill level',
          'Improve search result clarity',
          'Prepare acceptance criteria for filter usage',
        ]),
        userStoriesJson: JSON.stringify([
          'As a player, I want to join a match in fewer steps so I can complete the action faster.',
          'As a player, I want reliable reminders so I do not miss scheduled sessions.',
          'As a player, I want to clearly see whether a match is confirmed so I know what to expect.',
          'As a player, I want better search filters so I can find relevant players more efficiently.',
        ]),
        acceptanceCriteriaJson: JSON.stringify([
          'The join flow removes unnecessary steps and keeps the path clear.',
          'Reminder timing is triggered early enough for user action.',
          'Match confirmation state is visible in relevant session surfaces.',
          'Users can filter search results using more specific criteria.',
        ]),
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        currentStage: 'Tasks',
        status: 'tasks_generated',
      },
    });

    return this.formatTaskRun(taskRun);
  }

  async findLatest(projectId: string) {
    const taskRun = await this.prisma.taskRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    if (!taskRun) {
      throw new NotFoundException('No task run found for this project');
    }

    return this.formatTaskRun(taskRun);
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
      workBuckets: JSON.parse(taskRun.workBucketsJson),
      tasks: JSON.parse(taskRun.tasksJson),
      userStories: JSON.parse(taskRun.userStoriesJson),
      acceptanceCriteria: JSON.parse(taskRun.acceptanceCriteriaJson),
      createdAt: taskRun.createdAt,
      updatedAt: taskRun.updatedAt,
    };
  }
}