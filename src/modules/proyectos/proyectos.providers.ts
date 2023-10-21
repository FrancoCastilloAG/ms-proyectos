import { DataSource } from 'typeorm';
import { Proyecto } from '../../database/entities/proyecto.entity';

export const ProyectoProviders = [
  {
    provide: 'PROYECTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Proyecto),
    inject: ['DATA_SOURCE'],
  },
];
