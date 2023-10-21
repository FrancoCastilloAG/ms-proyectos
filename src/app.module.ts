import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProyectosModule } from './modules/proyectos/proyectos.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
  }),
    ProyectosModule,DatabaseModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
