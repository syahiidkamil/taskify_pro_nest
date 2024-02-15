import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/providers/prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';
import { TASK_STATUS } from './tasks.type';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    filterOptions: { status?: TASK_STATUS; sort?: string; order?: string },
    paginationOptions: { limit: number; offset: number },
  ): Promise<Task[]> {
    const { status, sort, order } = filterOptions;
    const { limit, offset } = paginationOptions;
    const orderBy = sort ? { [sort]: order } : {};

    return this.prisma.task.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy,
      take: limit,
      skip: offset,
    });
  }

  async findOne(
    userId: string,
    id: string,
    otherFilter: Task = {} as object as Task,
  ): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        id,
        userId,
        ...otherFilter,
      },
    });
  }

  async create(taskData: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...taskData,
      },
    });
  }

  async update(
    id: string,
    updateTaskDto: Prisma.TaskUpdateInput,
  ): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async updateStatus(id: string, status: TASK_STATUS): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
