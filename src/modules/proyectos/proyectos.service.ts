import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Proyecto } from '../../database/entities/proyecto.entity';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosError } from 'axios';
import { Team } from '../../database/entities/team.entity';
import { Tasks } from 'src/database/entities/tasks.entity';


@Injectable()
export class ProyectoService {
  constructor(
    @Inject('PROYECTO_REPOSITORY')
    private readonly proyectoRepository: Repository<Proyecto>,
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<Team>,
    @Inject('TASKS_REPOSITORY')
    private readonly tasksRepository: Repository<Tasks>,
    private readonly jwtService: JwtService,
  ) { }

  private decodeToken(token: string): string {
    const decodedToken = this.jwtService.decode(token);
    const tokenAsJSON = JSON.stringify(decodedToken);
    const tokenData = JSON.parse(tokenAsJSON);
    return tokenData.id;
  }

  async createProyecto(token: string, name: string): Promise<Proyecto> {
    try {
      const tokenData = this.decodeToken(token);

      const proyecto = new Proyecto();
      proyecto.name = name;
      proyecto.idOwner = tokenData;

      return this.proyectoRepository.save(proyecto);
    } catch (error) {
      throw new Error('Error al verificar el token JWT');
    }
  }

  async findProyectoById(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });

    if (!proyecto) {
      throw new Error(`No se encontró un proyecto con ID ${id}`);
    }

    return proyecto;
  }

  async deleteProyectoById(id: string, userId: string, enteredPassword: string): Promise<void> {
    try {
      const response = await axios.post(
        'http://localhost:3001/auth/verify-password',
        { userId, enteredPassword },
      );

      const isPasswordValid = response.data;

      if (!isPasswordValid) {
        // If the password is invalid, throw a 401 Unauthorized error
        throw new Error('Contraseña inválida');
      }

      // Obtener las tareas asociadas al proyecto
      const tareas = await this.tasksRepository.find({ where: { proyecto: { id } } });

      // Eliminar las tareas asociadas al proyecto
      await this.tasksRepository.remove(tareas);
      console.log(`Tareas eliminadas para el proyecto con ID: ${id}`);

      // Obtener el proyecto y sus relaciones antes de realizar operaciones de eliminación
      const proyecto = await this.proyectoRepository.findOne({ where: { id }, relations: ['teams', 'teams.members'] });

      if (!proyecto) {
        throw new Error('El proyecto no existe');
      }

      // Eliminar la relación entre el proyecto y los equipos y miembros del equipo
      proyecto.teams?.forEach((equipo) => {
        equipo.proyectos = equipo.proyectos?.filter((p) => p.id !== id) || [];

      });

      // Guardar los equipos actualizados en la base de datos
      await this.teamRepository.save(proyecto.teams || []);

      // Eliminar el proyecto
      const deleteResult = await this.proyectoRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new Error('No se pudo eliminar el proyecto');
      }
      console.log(`Proyecto con ID ${id} eliminado correctamente`);
    } catch (error:any) {
      if ((error as AxiosError).response) {
        // If there is a response, Axios will treat it as an error
        throw error;
      } else {
        // If there is no response, rethrow the original error
        throw new Error('Error al eliminar el proyecto: ' + error.message);
        
      }
    }
  }

  async getProyectosByToken(token: string): Promise<Proyecto[]> {
    try {
      const tokenData = this.decodeToken(token);
      const idOwner = tokenData;
      const proyectos = await this.proyectoRepository.find({ where: { idOwner } });
      return proyectos;
    } catch (error) {
      throw new Error('Error al obtener proyectos por ID de propietario');
    }
  }
  async addEquiposToProyecto(proyectoId: string, equipoData: { equipoId: string }): Promise<Team | undefined> {
    try {
      // Obtener el proyecto al que se agregarán los equipos
      const proyecto = await this.findProyectoById(proyectoId);

      // Buscar el equipo por ID
      const equipoExistente = await this.teamRepository.findOne({
        where: { id: equipoData.equipoId },
        relations: ['proyectos'], // Incluir la relación proyectos al buscar el equipo
      });

      if (equipoExistente) {
        // Verificar si el proyecto ya está asociado al equipo
        const proyectoExistente = equipoExistente.proyectos.find((p) => p.id === proyectoId);

        if (!proyectoExistente) {
          // Asignar el proyecto al equipo solo si no está asociado
          equipoExistente.proyectos = [...(equipoExistente.proyectos || []), proyecto];

          // Guardar el equipo actualizado en la base de datos
          const equipoActualizado = await this.teamRepository.save(equipoExistente);

          return equipoActualizado;
        } else {
          // Manejar el caso en que el equipo ya esté asociado al proyecto
          console.error(`El equipo con ID ${equipoData.equipoId} ya está asociado al proyecto con ID ${proyectoId}`);
          return undefined;
        }
      } else {
        // Manejar el caso en el que no se encuentre el equipo
        console.error(`No se encontró un equipo con ID ${equipoData.equipoId}`);
        return undefined;
      }
    } catch (error) {
      // Manejar el error según tus necesidades
      console.error('Error al agregar equipos al proyecto:', error);
      return undefined;
    }
  }



  async deleteEquipoFromProyecto(proyectoId: string, equipoId: string): Promise<void> {
    try {
      // Obtener el equipo por ID
      const equipo = await this.teamRepository.findOne({
        where: { id: equipoId },
        relations: ['proyectos'], // Incluir la relación proyectos al buscar el equipo
      });

      if (!equipo) {
        console.log(`No se encontró un equipo con ID ${equipoId}`);
      } else {
        // Filtrar los proyectos para excluir el proyecto que se va a eliminar
        equipo.proyectos = equipo.proyectos.filter((proyecto) => proyecto.id !== proyectoId);

        // Guardar el equipo actualizado en la base de datos
        await this.teamRepository.save(equipo);
      }
    } catch (error) {
      // Manejar el error según tus necesidades
      console.error('Error al eliminar equipo del proyecto:', error);
    }
  }


  async getEquiposByProyecto(proyectoId: string): Promise<Team[] | undefined> {
    try {
      const equipos = await this.teamRepository.find({
        relations: ['proyectos'], // Incluir la relación proyectos al buscar los equipos
        where: {
          proyectos: { id: proyectoId },
        },
      });

      return equipos;
    } catch (error) {
      // Manejar el error según tus necesidades
      console.error('Error al obtener equipos por proyecto:', error);
      return undefined;
    }
  }
}
