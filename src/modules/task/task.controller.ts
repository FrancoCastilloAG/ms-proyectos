import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { TasksService } from './task.service';
import { Tasks } from '../../database/entities/tasks.entity';

@Controller('task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() taskData: { nombre: string; idUser: string; idProyecto: string; encargado?: string; desc?: string }): Promise<Tasks> {
    try {
      const { nombre, idUser, idProyecto, encargado, desc } = taskData;

      // Llama al método createTask del servicio
      const newTask = await this.tasksService.createTask(nombre, idUser, idProyecto, encargado, desc);

      return newTask;
    } catch (error) {
      throw new Error('Error al crear la tarea en el controlador');
    }
  }

  @Get(':idProyecto')
  async findTasksByProyectoId(@Param('idProyecto') idProyecto: string): Promise<Tasks[]> {
    try {
      const tasks = await this.tasksService.findTasksByProyectoId(idProyecto);

      return tasks;
    } catch (error) {
      // Manejar errores y devolver una respuesta apropiada
      throw new Error('Error al buscar tareas por ID de proyecto en el controlador');
    }
  }

  @Delete(':id')
  async deleteTaskById(@Param('id') id: string): Promise<{ message: string } | { error: string }> {
    try {
      await this.tasksService.deleteTaskById(id);
      return { message: 'Tarea eliminada correctamente' };
    } catch (error) {
      return { error: 'Error al eliminar la tarea' };
    }
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('desc') desc?: string,
    @Body('encargado') encargado?: string,
    @Body('estado') estado?: string
  ): Promise<Tasks | { error: string }> {
    try {
      const updatedTask = await this.tasksService.updateTask(id, desc, encargado, estado);
      return updatedTask;
    } catch (error) {
      return { error: 'Error al actualizar la tarea' };
    }
  }
}
