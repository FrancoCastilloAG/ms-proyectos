import { Module } from '@nestjs/common';
import { ProyectoService } from './proyectos.service';
import { ProyectoController } from './proyectos.controller';
import { ProyectoProviders } from './proyectos.providers';
import { JwtModule } from '@nestjs/jwt';
import { TeamModule } from '../team/team.module';
import { TeamProviders } from '../team/team.providers';
import { forwardRef } from '@nestjs/common';
import { TaskModule } from '../task/task.module';
import { TasksProviders } from '../task/task.providers';


@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET, // Reemplaza con tu clave secreta
    signOptions: { expiresIn: '12h' }, // Opciones de JWT
  }),forwardRef(() => TeamModule),forwardRef(() => TaskModule)],
  providers: [ProyectoService, ...ProyectoProviders,...TeamProviders,...TasksProviders],
  controllers: [ProyectoController],
  exports: [ProyectoService, ...ProyectoProviders],
})
export class ProyectosModule { }
