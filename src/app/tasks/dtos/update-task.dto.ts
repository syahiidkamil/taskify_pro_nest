import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';
import { TASK_STATUS } from '../tasks.type';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Finalize Project Report',
    description: 'The title of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example:
      'Ensure all documents are reviewed and finalized before submission.',
    description: 'Detailed description of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 2,
    description:
      'The priority level of the task, with a higher number indicating higher priority.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiProperty({
    example: TASK_STATUS.PENDING,
    enum: TASK_STATUS,
    description: 'The current status of the task.',
    required: false,
  })
  @IsOptional()
  @IsEnum(TASK_STATUS, {
    message: 'Status must be either PENDING or COMPLETE',
  })
  status?: TASK_STATUS;

  @ApiProperty({
    example: '2024-02-20T12:00:00.000Z',
    description:
      'The due date for completing the task, in ISO 8601 date string format.',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
