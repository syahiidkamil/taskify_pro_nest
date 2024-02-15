import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';

import { TASK_STATUS } from '../tasks.type';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsEnum(TASK_STATUS, {
    message: 'Status must be either PENDING or COMPLETE',
  })
  status?: TASK_STATUS;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
