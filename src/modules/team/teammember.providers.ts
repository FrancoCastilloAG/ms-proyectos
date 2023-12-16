import { DataSource } from 'typeorm';
import {TeamMember} from "../../database/entities/teammember.entity"

export const TeamMemberProviders = [
    {
      provide: 'TEAMMEMBER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(TeamMember),
      inject: ['DATA_SOURCE'],
    },
  ];
