import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { TasksProviders } from './task.providers';
import { JwtModule } from '@nestjs/jwt';
import { ProyectosModule } from '../proyectos/proyectos.module'; 
import { ProyectoProviders } from '../proyectos/proyectos.providers';

@Module({
  imports: [    JwtModule.register({
    secret: process.env.JWT_SECRET, // Reemplaza con tu clave secreta
    signOptions: { expiresIn: '12h' }, // Opciones de JWT
  }),ProyectosModule],
  controllers: [TasksController],
  providers: [TasksService,...TasksProviders,...ProyectoProviders]
})
export class TaskModule {}
