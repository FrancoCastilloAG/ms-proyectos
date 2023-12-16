import { Controller, Post, Body, Request, Get, Param, Delete } from '@nestjs/common';
import { ProyectoService } from './proyectos.service';
import { Proyecto } from '../../database/entities/proyecto.entity';
import { Team } from '../../database/entities/team.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) { }

  @Post()
  async createProyecto(@Body() proyectoData: { name: string, idOwner: string }): Promise<Proyecto> {
    const { name, idOwner } = proyectoData;

    // Llama al servicio y pasa el nombre del proyecto y el idOwner directamente
    const proyecto: Proyecto = await this.proyectoService.createProyecto(idOwner, name);

    return proyecto;
  }

  @Get(':token')
  async getProyectosByToken(@Param('token') token: string): Promise<Proyecto[]> {
    // Llama al servicio para obtener proyectos utilizando el token
    const proyectos: Proyecto[] = await this.proyectoService.getProyectosByToken(token);
    return proyectos;
  }

  @Get('detalle/:token')
  async getfindProyectoById(@Param('token') token: string): Promise<Proyecto | undefined> {
    // Llama al servicio para obtener proyectos utilizando el token
    const proyecto: Proyecto | undefined = await this.proyectoService.findProyectoById(token);
    return proyecto;
  }

  @Delete('delete')
  async deleteProyectoById(@Body() body: { id: string, token: string, contraseña: string }): Promise<{ mensaje: string }> {
    try {
      const { id, token, contraseña } = body;
      await this.proyectoService.deleteProyectoById(id, token, contraseña);
      return { mensaje: 'Proyecto eliminado correctamente' };
    } catch (error: any) {
      return { mensaje: error.message };
    }
  }

  @Post(':proyectoId/equipos')
  async addEquiposToProyecto(
    @Param('proyectoId') proyectoId: string,
    @Body() equipoData: { equipoId: string },
  ): Promise<Team | undefined> {
    try {
      const equipoActualizado: Team | undefined = await this.proyectoService.addEquiposToProyecto(
        proyectoId,
        equipoData,
      );

      if (equipoActualizado) {
        return equipoActualizado;
      } else {
        // Puedes devolver un código de estado diferente o un mensaje específico según tus necesidades
        return undefined;
      }
    } catch (error) {
      // Puedes devolver un código de estado diferente o un mensaje específico según tus necesidades
      console.error('Error en el controlador:', error);
      return undefined;
    }
  }

  @Delete(':proyectoId/equipos/:equipoId')
  async deleteEquipoFromProyecto(
    @Param('proyectoId') proyectoId: string,
    @Param('equipoId') equipoId: string,
  ): Promise<void> {
    try {
      await this.proyectoService.deleteEquipoFromProyecto(proyectoId, equipoId);
    } catch (error) {
      // Manejar el error según tus necesidades
      console.error('Error al eliminar el equipo del proyecto:', error);
    }
  }

  @Get(':proyectoId/equipos')
  async getEquiposByProyecto(@Param('proyectoId') proyectoId: string): Promise<Team[] | undefined> {
    try {
      const equipos: Team[] | undefined = await this.proyectoService.getEquiposByProyecto(proyectoId);
      return equipos;
    } catch (error) {
      // Puedes devolver un código de estado diferente o un mensaje específico según tus necesidades
      console.error('Error en el controlador:', error);
      return undefined;
    }
  }
}
