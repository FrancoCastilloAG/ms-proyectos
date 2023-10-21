import { Controller, Post, Body ,Get,Param} from '@nestjs/common';
import { TasksService } from './task.service';

@Controller('task')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post() // Maneja las solicitudes POST en la ruta base del controlador
    async createTask(@Body() taskData) {
      try {
        const { nombre, fecha, idUser, idProyecto } = taskData;
  
        // Llama al método createTask del servicio
        const newTask = await this.tasksService.createTask(nombre, fecha, idUser, idProyecto);
  
        return newTask;
      } catch (error) {
        // Maneja errores y devuelve una respuesta adecuada
        throw new Error('Error al crear la tarea');
      }
    }
    @Get(':idProyecto')
    async findTasksByProyectoId(@Param('idProyecto') idProyecto: string) {
      try {
        const tasks = await this.tasksService.findTasksByProyectoId(idProyecto);
  
        return tasks;
      } catch (error) {
      }
    }
}
