import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';

@Module({
  providers: [TasksService, TasksRepository],
  controllers: [TasksController],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
