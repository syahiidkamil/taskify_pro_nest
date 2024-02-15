import { Prisma, Task } from '@prisma/client';

import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TASK_STATUS } from './tasks.type';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async findAll(
    userId: string,
    filterOptions: { status?: TASK_STATUS; sort?: string; order?: string },
    paginationOptions: { limit: number; offset: number },
  ) {
    return this.tasksRepository.findAll(userId, filterOptions, {
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.tasksRepository.findOne(userId, id);
    if (!task) {
      throw new NotFoundException(
        `Task with ID "${id}" not found nor belongs to you`,
      );
    }
    return task;
  }

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: Prisma.TaskCreateInput = {
      ...createTaskDto,
      user: {
        connect: { id: userId },
      },
      status: TASK_STATUS.PENDING,
    };
    return this.tasksRepository.create(taskData);
  }

  async update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    await this.verifyTaskOwnership(userId, taskId);
    return this.tasksRepository.update(taskId, updateTaskDto);
  }

  async updateStatus(userId: string, taskId: string, status: TASK_STATUS) {
    await this.verifyTaskOwnership(userId, taskId);
    return this.tasksRepository.updateStatus(taskId, status);
  }

  async delete(userId: string, taskId: string) {
    await this.verifyTaskOwnership(userId, taskId);
    return this.tasksRepository.delete(taskId);
  }

  private async verifyTaskOwnership(
    userId: string,
    taskId: string,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne(userId, taskId);
    if (!task) {
      throw new NotFoundException(
        `Task with ID "${taskId}" not found or does not belong to you.`,
      );
    }
    return task;
  }
}
