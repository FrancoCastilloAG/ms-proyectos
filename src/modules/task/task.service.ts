import { Injectable , Inject ,NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tasks } from '../../database/entities/tasks.entity';
import { JwtService } from '@nestjs/jwt';
import { ProyectoService } from '../proyectos/proyectos.service'; 

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_REPOSITORY')
    private readonly tasksRepository: Repository<Tasks>,
    private readonly jwtService: JwtService,
    private readonly proyectosService: ProyectoService,
  ) {}
  async createTask(nombre: string, fecha: string, idUser: string, idProyecto: string): Promise<Tasks> {
    try {
      const decodedToken = this.jwtService.decode(idUser);
      const tokenAsJSON = JSON.stringify(decodedToken);
      const string = JSON.parse(tokenAsJSON);
      const idOwner = string.id;

      // Utiliza el servicio de proyectos para buscar el proyecto
      const proyecto = await this.proyectosService.findProyectoById(idProyecto);

      const task = new Tasks();
      task.nombre = nombre;
      task.fecha = fecha;
      task.idUser = idOwner;
      task.proyecto = proyecto; // Asigna el proyecto a la tarea

      return this.tasksRepository.save(task);
    } catch (error) {
      throw new Error('Error al crear la tarea');
    }
  }
  async findTasksByProyectoId(idProyecto: string): Promise<Tasks[]> {
    try {
      // Utiliza el servicio de proyectos para buscar el proyecto por su ID
      const proyecto = await this.proyectosService.findProyectoById(idProyecto);

      if (!proyecto) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      // Busca todas las tareas asociadas a ese proyecto
      const tasks = await this.tasksRepository.find({
        where: { proyecto: proyecto },
      });

      return tasks;
    } catch (error) {
      throw new Error('Error al buscar las tareas del proyecto');
    }
  }
}
