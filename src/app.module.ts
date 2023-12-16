import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProyectosModule } from './modules/proyectos/proyectos.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './modules/task/task.module';
import { TeamController } from './modules/team/team.controller';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
  }),
    ProyectosModule,DatabaseModule, TaskModule, TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
