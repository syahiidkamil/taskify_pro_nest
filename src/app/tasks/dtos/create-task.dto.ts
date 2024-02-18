import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete the monthly financial report',
    description: 'The title of the task',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Gather all financial statements and compile them into the report.',
    description: 'Detailed description of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1,
    description:
      'The priority level of the task, with a lower number indicating higher priority.',
    required: false,
  })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiProperty({
    example: '2024-03-31T23:59:59.999Z',
    description:
      'The due date for completing the task, in ISO 8601 date string format.',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
