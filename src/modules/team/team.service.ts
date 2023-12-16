import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Team } from '../../database/entities/team.entity';
import { TeamMember } from '../../database/entities/teammember.entity';
import { ProyectoService } from '../proyectos/proyectos.service';
import axios from 'axios';

@Injectable()
export class TeamService {
  constructor(
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<Team>,
    @Inject('TEAMMEMBER_REPOSITORY')
    private readonly teamMemberRepository: Repository<TeamMember>,
    private readonly proyectosService: ProyectoService,
  ) {}

  async findAllTeams(): Promise<Team[]> {
    // Obtener todos los equipos en la base de datos
    return this.teamRepository.find();
  }

  // ...

  async createTeam(nombre: string, proyectoId?: string, miembros: string[] = []): Promise<Team | null> {
    try {
      let proyecto;
      // Verificar si se proporciona el proyectoId y obtener el proyecto correspondiente
      if (proyectoId) {
        proyecto = await this.proyectosService.findProyectoById(proyectoId);
      }

      // Crear un nuevo equipo
      const nuevoEquipo = new Team();
      nuevoEquipo.nombre = nombre; // Asignar el nombre del equipo

      // Asignar el proyecto solo si se proporciona el proyectoId

      // Guardar el nuevo equipo en la base de datos
      const equipo = await this.teamRepository.save(nuevoEquipo);
      if (miembros.length == 0) {
      } else {
        // Agregar miembros al equipo
        await this.addMembersToTeam(equipo.id, miembros);
      }

      return equipo;
    } catch (error) {
      // Solo arrojar la excepción si hay un problema real
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al crear el equipo:', error);
      return null; // Puedes retornar null o cualquier otro valor según tus necesidades
    }
  }

  async getTeamsByProyecto(proyectoId: string): Promise<Team[]> {
    // Verificar si el proyecto existe
    await this.proyectosService.findProyectoById(proyectoId);

    // Obtener todos los equipos asociados al proyecto
    return this.teamRepository.find({ where: { proyectos: { id: proyectoId } } });
  }

  async updateTeam(teamId: string, nuevoNombre: string): Promise<Team> {
    // Verificar si el equipo existe
    const equipo = await this.findTeamById(teamId);

    // Actualizar el nombre del equipo
    equipo.nombre = nuevoNombre;

    // Guardar los cambios en la base de datos
    return this.teamRepository.save(equipo);
  }

  async deleteTeam(teamId: string): Promise<void> {
    // Verificar si el equipo existe
    const equipo = await this.findTeamById(teamId);

    // Eliminar el equipo de la base de datos
    await this.teamRepository.remove(equipo);
  }

  async findTeamById(teamId: string): Promise<Team> {
    const equipo = await this.teamRepository.findOne({ where: { id: teamId } });

    if (!equipo) {
      throw new NotFoundException(`No se encontró un equipo con ID ${teamId}`);
    }

    return equipo;
  }
  async addMembersToTeam(teamId: string, memberEmails: string[]): Promise<void> {
    try {
      // Obtener el equipo al que se agregarán los miembros
      const team = await this.findTeamById(teamId);
  
      // Verificar si hay correos electrónicos proporcionados
      if (!memberEmails || memberEmails.length === 0) {
        throw new BadRequestException('Debe proporcionar al menos un correo electrónico de miembro');
      }
  
      // Utilizar Promise.all para realizar las solicitudes en paralelo
      const users = await Promise.all(
        memberEmails.map(async (email) => {
          try {
            const userResponse = await axios.get(`http://localhost:3001/users/${email}`);
            return userResponse.data;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 404) {
                throw new NotFoundException(`No se encontró un usuario con el correo electrónico ${email}`);
              } else {
                throw new BadRequestException('Error al obtener información del usuario');
              }
            } else {
              throw error;
            }
          }
        })
      );
  
      // Verificar si algún usuario ya está presente en el equipo
      const existingMembers = await this.teamMemberRepository.find({
        where: { teams: { id: teamId }, userId: In(users.map(user => user.id)) },
      });
  
      // Filtrar los usuarios que ya son miembros del equipo
      const newUsers = users.filter(user => !existingMembers.some(member => member.userId === user.id));
  
      if (newUsers.length === 0) {
        throw new BadRequestException('Todos los usuarios ya son miembros del equipo');
      }
  
      // Crear y guardar TeamMembers solo para los nuevos usuarios
      const teamMembers = newUsers.map((user) => {
        const teamMember = new TeamMember();
        teamMember.teams = [team]; // Asignar el equipo directamente al miembro
        teamMember.userId = user.id;
        teamMember.email = user.email;
        teamMember.nombre = user.nombre;
        teamMember.role = 'Miembro';
        return teamMember;
      });
  
      await this.teamMemberRepository.save(teamMembers);
    } catch (error) {
      // Re-lanzar el error para que el controlador pueda manejarlo adecuadamente
      throw error;
    }
  }
  

  async deleteTeamMember(teamId: string, userId: string): Promise<void> {
    try {
      // Obtener el equipo al que se eliminará el miembro
      const team = await this.findTeamById(teamId);
  
      // Verificar si el miembro existe en el equipo
      const teamMember = await this.teamMemberRepository.findOne({
        where: { teams: { id: teamId }, userId: userId },
      });
  
      if (!teamMember) {
        throw new NotFoundException(`No se encontró un miembro con ID ${userId} en el equipo`);
      }
  
      // Eliminar el miembro del equipo en la base de datos
      await this.teamMemberRepository.remove(teamMember);
    } catch (error) {
      // Re-lanzar el error para que el controlador pueda manejarlo adecuadamente
      throw error;
    }
  }
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      // Obtener el equipo por ID
      const team = await this.findTeamById(teamId);
  
      // Obtener los miembros del equipo
      const teamMembers = await this.teamMemberRepository.find({
        where: { teams: { id: team.id } },
      });
  
      return teamMembers;
    } catch (error) {
      // Re-lanzar el error para que el controlador pueda manejarlo adecuadamente
      throw error;
    }
  }  
  async changeTeamMemberRole(teamId: string, userId: string, newRole: string): Promise<void> {
    try {
  
      // Obtener el miembro del equipo por ID de usuario
      const teamMember = await this.teamMemberRepository.findOne({
        where: { teams: { id: teamId }, userId: userId },
      });
  
      // Verificar si el miembro existe en el equipo
      if (!teamMember) {
        throw new NotFoundException(`No se encontró un miembro con ID ${userId} en el equipo`);
      }
  
      // Cambiar el rol del miembro
      teamMember.role = newRole;
  
      // Guardar los cambios en la base de datos
      await this.teamMemberRepository.save(teamMember);
    } catch (error) {
      // Re-lanzar el error para que el controlador pueda manejarlo adecuadamente
      throw error;
    }
  }
}
