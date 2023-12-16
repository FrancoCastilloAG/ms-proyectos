import { Injectable, Inject, NotFoundException } from '@nestjs/common';
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

  async createTask(
    nombre: string,
    idUser: string,
    idProyecto: string,
    encargado?: string,
    desc?: string,
  ): Promise<Tasks> {
    try {
      const decodedToken = this.jwtService.decode(idUser);
      const tokenAsJSON = JSON.stringify(decodedToken);
      const string = JSON.parse(tokenAsJSON);
      const idOwner = string.id;

      // Utiliza el servicio de proyectos para buscar el proyecto
      const proyecto = await this.proyectosService.findProyectoById(idProyecto);

      const task = new Tasks();
      task.nombre = nombre;
      task.idUser = idOwner;
      task.proyecto = proyecto;
      task.encargado = encargado || null;
      task.estado = 'propuesto';
      task.desc = desc || null; // Asigna la descripción o null

      return this.tasksRepository.save(task);
    } catch (error) {
      throw new Error('Error al crear la tarea');
    }
  }

  async findTasksByProyectoId(idProyecto: string): Promise<Tasks[]> {
    try {
      const proyecto = await this.proyectosService.findProyectoById(idProyecto);

      if (!proyecto) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      const tasks = await this.tasksRepository.find({
        where: { proyecto: { id: idProyecto } },
      });

      return tasks;
    } catch (error) {
      throw new Error('Error al buscar las tareas del proyecto');
    }
  }

  async deleteTaskById(id: string): Promise<void> {
    try {
      const result = await this.tasksRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Tarea no encontrada');
      }
    } catch (error) {
      throw new Error('Error al eliminar la tarea');
    }
  }

  async updateTask(
    id: string,
    desc?: string,
    encargado?: string,
    estado?: string,
  ): Promise<Tasks> {
    try {
      const task = await this.tasksRepository.findOne({ where: { id: id } });

      if (!task) {
        throw new NotFoundException('Tarea no encontrada');
      }

      if (desc !== undefined) {
        task.desc = desc;
      }

      if (encargado !== undefined) {
        task.encargado = encargado;
      }

      if (estado !== undefined) {
        task.estado = estado;
      }

      return this.tasksRepository.save(task);
    } catch (error) {
      throw new Error('Error al actualizar la tarea');
    }
  }
}
