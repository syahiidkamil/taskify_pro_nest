import { IsEnum, IsNotEmpty } from 'class-validator';

import { TASK_STATUS } from '../tasks.type';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TASK_STATUS, {
    message: 'Status must be either PENDING or COMPLETE',
  })
  status: TASK_STATUS;
}
