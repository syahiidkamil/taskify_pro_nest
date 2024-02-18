import { ApiProperty } from '@nestjs/swagger';
import { TASK_STATUS } from '../tasks.type';

export class TaskResponseDto {
  @ApiProperty({ example: '65d196193ce32c2bad33f44a' })
  id: string;

  @ApiProperty({ example: 'New Task' })
  title: string;

  @ApiProperty({ example: '', type: 'string', nullable: true })
  description?: string;

  @ApiProperty({ example: 0 })
  priority: number;

  @ApiProperty({ example: TASK_STATUS.PENDING })
  status: TASK_STATUS;

  @ApiProperty({
    example: '2024-02-18T05:31:05.046Z',
    type: 'string',
    format: 'date-time',
  })
  dueDate?: Date;

  @ApiProperty({
    example: '2024-02-18T05:31:05.046Z',
    type: 'string',
    format: 'date-time',
  })
  createdDate: Date;

  @ApiProperty({ example: '65d0baa39891d4bf4a8a895f' })
  userId: string;
}
