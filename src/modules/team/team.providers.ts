import { DataSource } from 'typeorm';
import {Team} from "../../database/entities/team.entity"

export const TeamProviders = [
    {
      provide: 'TEAM_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Team),
      inject: ['DATA_SOURCE'],
    },
  ];
