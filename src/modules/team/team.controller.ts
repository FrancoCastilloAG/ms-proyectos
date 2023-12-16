import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { TeamService } from './team.service';
  import { Team } from '../../database/entities/team.entity';
  import { TeamMember } from '../../database/entities/teammember.entity';
  
  @Controller('teams')
  export class TeamController {
    constructor(private readonly teamService: TeamService) {}
  
    @Get()
    async getAllTeams(): Promise<Team[]> {
      return this.teamService.findAllTeams();
    }
  
    @Post()
    async createTeam(@Body() body: { nombre: string; proyectoId: string; miembros?: string[] }): Promise<Team | null> {
      const { nombre, proyectoId, miembros } = body;
  
      try {
        return this.teamService.createTeam(nombre, proyectoId, miembros);
      } catch (error: any) {
        throw new BadRequestException(error.message);
      }
    }
  
    @Patch(':teamId')
    async updateTeam(@Body() body: { teamId: string; nuevoNombre: string }): Promise<Team> {
      const { teamId, nuevoNombre } = body;
      try {
        return this.teamService.updateTeam(teamId, nuevoNombre);
      } catch (error: any) {
        throw new BadRequestException(error.message);
      }
    }
  
    @Delete(':teamId')
    async deleteTeam(@Param('teamId') teamId: string): Promise<void> {
      try {
        await this.teamService.deleteTeam(teamId);
      } catch (error: any) {
        throw new NotFoundException(error.message);
      }
    }
    @Post(':teamId/members')
    async addMembersToTeam(@Param('teamId') teamId: string, @Body('memberEmails') memberEmails: string[]) {
      return this.teamService.addMembersToTeam(teamId, memberEmails);
    }
    @Delete(':teamId/members/:userId')
    async deleteTeamMember(@Param('teamId') teamId: string, @Param('userId') userId: string): Promise<void> {
      try {
        await this.teamService.deleteTeamMember(teamId, userId);
      } catch (error: any) {
        throw new NotFoundException(error.message);
      }
    }
    @Get(':teamId/members')
    async getTeamMembers(@Param('teamId') teamId: string): Promise<TeamMember[]> {
      return this.teamService.getTeamMembers(teamId);
    }
    @Get(':id')
    async findTeamById(@Param('id') teamId: string): Promise<Team> {
      try {
        const equipo = await this.teamService.findTeamById(teamId);
        return equipo;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`No se encontró un equipo con ID ${teamId}`);
        }
        throw error;
      }
    }
    @Patch(':teamId/members/:userId/change-role')
    async changeTeamMemberRole(
      @Param('teamId') teamId: string,
      @Param('userId') userId: string,
      @Body('newRole') newRole: string,
    ) {
      return this.teamService.changeTeamMemberRole(teamId, userId, newRole);
    }
  }
  