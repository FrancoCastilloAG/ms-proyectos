import { Module } from '@nestjs/common';
import { ProyectoService } from './proyectos.service';
import { ProyectoController } from './proyectos.controller';
import { ProyectoProviders } from './proyectos.providers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [    JwtModule.register({
    secret: process.env.JWT_SECRET, // Reemplaza con tu clave secreta
    signOptions: { expiresIn: '12h' }, // Opciones de JWT
  })],
  providers: [ProyectoService, ...ProyectoProviders],
  controllers: [ProyectoController],
  exports: [ProyectoService,...ProyectoProviders],
})
export class ProyectosModule {}
