import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { forwardRef } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtModule } from '@nestjs/jwt';
import { TeamProviders } from './team.providers';
import { TeamMemberProviders } from './teammember.providers';
import { ProyectosModule } from '../proyectos/proyectos.module'; 
import { ProyectoProviders } from '../proyectos/proyectos.providers';

@Module({
  imports: [    JwtModule.register({
    secret: process.env.JWT_SECRET, // Reemplaza con tu clave secreta
    signOptions: { expiresIn: '12h' }, // Opciones de JWT
  }),forwardRef(() => ProyectosModule)],
  controllers: [TeamController],
  providers: [TeamService,...TeamProviders,...ProyectoProviders,...TeamMemberProviders],
  exports: [TeamService, ...TeamProviders]
})
export class TeamModule {}
