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
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { GetUserId } from 'src/common/get-user-id.decorator';
import { JwtGuard } from 'src/core/auth/guards/jwt.guard';
import { CreateTaskDto } from '../tasks/dtos/create-task.dto';
import { UpdateTaskStatusDto } from '../tasks/dtos/update-task-status.dto';
import { UpdateTaskDto } from '../tasks/dtos/update-task.dto';
import { TasksService } from '../tasks/tasks.service';
import { TASK_STATUS } from './tasks.type';
import { TaskResponseDto } from './dtos/task-response.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of tasks',
    description:
      'Get all tasks for the authenticated user with optional filters for status, sorting, and pagination.',
  })
  @ApiQuery({ name: 'status', enum: TASK_STATUS, required: false })
  @ApiQuery({ name: 'sort', type: 'string', required: false })
  @ApiQuery({ name: 'order', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of task retrieved successfully',
    type: [TaskResponseDto],
  })
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
  @ApiOperation({
    summary: 'Retrieve a single task',
    description:
      'Get details of a specific task by its ID for the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the task',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  findOne(@GetUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.findOne(userId, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Create a new task with the given details for the authenticated user.',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  create(@GetUserId() userId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(userId, createTaskDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Update the details of a specific task by its ID for the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the task to update',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  update(
    @GetUserId() userId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update task status',
    description:
      'Change the status of a specific task by its ID for the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the task to update its status',
  })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    type: TaskResponseDto,
  })
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
  @ApiOperation({
    summary: 'Delete a task',
    description:
      "Remove a specific task by its ID from the authenticated user's task list.",
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the task to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
  })
  delete(@GetUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.delete(userId, id);
  }
}
