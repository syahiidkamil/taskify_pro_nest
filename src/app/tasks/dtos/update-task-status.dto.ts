import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TASK_STATUS } from '../tasks.type';

export class UpdateTaskStatusDto {
  @ApiProperty({
    example: TASK_STATUS.COMPLETE,
    description: 'The new status of the task',
    enum: TASK_STATUS,
  })
  @IsNotEmpty()
  @IsEnum(TASK_STATUS, {
    message: 'Status must be either PENDING or COMPLETE',
  })
  status: TASK_STATUS;
}
