import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUserId } from 'src/common/get-user-id.decorator';
import { JwtGuard } from 'src/core/auth/guards/jwt.guard';
import { CreateTaskDto } from '../tasks/dtos/create-task.dto';
import { UpdateTaskStatusDto } from '../tasks/dtos/update-task-status.dto';
import { UpdateTaskDto } from '../tasks/dtos/update-task.dto';
import { TasksService } from '../tasks/tasks.service';
import { TASK_STATUS } from './tasks.type';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @GetUserId() userId: string,
    @Query('status') status?: TASK_STATUS,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const paginationOptions = {
      limit: Number(limit),
      offset: Number(offset),
    };
    return this.tasksService.findAll(
      userId,
      { status, sort, order },
      paginationOptions,
    );
  }

  @Get(':id')
  findOne(@GetUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(userId, id);
  }

  @Post()
  create(@GetUserId() userId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Put(':id')
  update(
    @GetUserId() userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Patch(':id/status')
  updateStatus(
    @GetUserId() userId: string,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(
      userId,
      id,
      updateTaskStatusDto.status,
    );
  }

  @Delete(':id')
  delete(@GetUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.delete(userId, id);
  }
}
