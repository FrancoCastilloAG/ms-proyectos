import { Injectable , Inject} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Proyecto } from '../../database/entities/proyecto.entity';
import { JwtService } from '@nestjs/jwt';
import { Tasks } from '../../database/entities/tasks.entity';
import { TasksService } from '../task/task.service';


@Injectable()
export class ProyectoService {
  constructor(
    @Inject('PROYECTO_REPOSITORY')
    private readonly proyectoRepository: Repository<Proyecto>,
    private readonly jwtService: JwtService,
  ) {}

  async createProyecto(token: string, name: string): Promise<Proyecto> {
    try {
      const decodedToken = this.jwtService.decode(token);
      const tokenAsJSON = JSON.stringify(decodedToken);
      const string = JSON.parse(tokenAsJSON);
      const idOwner = string.id;

      const proyecto = new Proyecto();
      proyecto.name = name;
      proyecto.idOwner = idOwner;

      return this.proyectoRepository.save(proyecto);
    } catch (error) {
      throw new Error('Error al verificar el token JWT');
    }
  }
  async findProyectoById(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });

    return proyecto;
  }
  async deleteProyectoById(id: string): Promise<void> {
    try {
      // Busca el proyecto por su ID en la base de datos
      const proyecto = await this.proyectoRepository.findOne({ where: { id } });

      if (!proyecto) {
        throw new Error('El proyecto no existe');
      }

      // Elimina el proyecto
      await this.proyectoRepository.remove(proyecto);
    } catch (error) {
      throw new Error('Error al eliminar el proyecto');
    }
  }
  async getProyectosByToken(token: string): Promise<Proyecto[]> {
    try {
      const decodedToken = this.jwtService.decode(token);
      const tokenAsJSON = JSON.stringify(decodedToken);
      const tokenData = JSON.parse(tokenAsJSON);
      const idOwner = tokenData.id;
      const proyectos = await this.proyectoRepository.find({ where: { idOwner } });
      return proyectos;
    } catch (error) {
      throw new Error('Error al obtener proyectos por ID de propietario');
    }
  }
  /* async getTareasDeProyecto(idProyecto: string): Promise<Tasks[]> {
    try {
      const proyecto = await this.proyectoRepository.findOne(idProyecto, {
        relations: ['tasks'], // Esto cargará las tareas relacionadas con el proyecto
      });
  
      if (!proyecto) {
        throw new Error('El proyecto no existe');
      }
  
      return proyecto.tasks;
    } catch (error) {
      throw new Error('Error al obtener las tareas del proyecto');
    }
  } */
  
}
