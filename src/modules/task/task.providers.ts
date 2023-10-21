import { DataSource } from 'typeorm';
import { Tasks } from '../../database/entities/tasks.entity';

export const TasksProviders = [
    {
      provide: 'TASKS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Tasks),
      inject: ['DATA_SOURCE'],
    },
  ];