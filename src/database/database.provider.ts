import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Proyecto } from './entities/proyecto.entity';
import { Tasks } from './entities/tasks.entity';
import { Worker } from './entities/workers.entity';

dotenv.config();

const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT,
} = process.env;

const dataSource = new DataSource({
  type: 'postgres',
  host: TYPEORM_HOST,
  port: +TYPEORM_PORT,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  logging: true,
  synchronize: false,
  entities: [Proyecto,Worker,Tasks],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];

export default dataSource;
