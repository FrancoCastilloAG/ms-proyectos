import { Controller, Post, Body, Request, Get, Param, Delete} from '@nestjs/common';
import { ProyectoService } from './proyectos.service';
import { Proyecto } from '../../database/entities/proyecto.entity';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) { }

  @Post()
  async createProyecto(@Body() proyectoData, @Request() req) {
    const { name, idOwner } = proyectoData;

    // Llama al servicio y pasa el nombre del proyecto y el idOwner directamente
    const proyecto = await this.proyectoService.createProyecto(idOwner, name);

    return proyecto;
  }
  @Delete(':id')
  async deleteProyecto(@Param('id') id: string) {
    // Llama al método del servicio para eliminar el proyecto por ID
    await this.proyectoService.deleteProyectoById(id);
    // Devuelve una respuesta adecuada, como un mensaje de éxito
    return { message: 'Proyecto eliminado con éxito' };
  }
  @Get(':token')
  async getProyectosByToken(@Param('token') token: string): Promise<Proyecto[]> {
    // Llama al servicio para obtener proyectos utilizando el token
    const proyectos = await this.proyectoService.getProyectosByToken(token);
    return proyectos;
  }
  
}
