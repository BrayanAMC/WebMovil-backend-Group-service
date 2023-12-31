import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member-dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Team, CreateTeamResponse, AddMemberResponse } from './entities/team.entity'
import { Repository } from 'typeorm';
import { findTeamsByIdInput } from './dto/input-team';
import axios from 'axios';

@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
  ) { }

  async create(createTeamDto: CreateTeamDto): Promise<CreateTeamResponse> {
    const name = createTeamDto.name;
    const idCreator = createTeamDto.idCreator;
    const team = await this.teamRepository.findOne({
      where: { name, idCreator }
    })
    

    if (team) {//the team already exists
      return { success: false, message: 'Team already exists' };
    }

    //save team in database
    const newTeam = this.teamRepository.create(
      createTeamDto,
    )
    await this.teamRepository.save(newTeam);
    return { success: true, message: "Team created successfully", idTeam: newTeam.id };

  }

  async addMember(idTeam: number, idNewMember: number): Promise<AddMemberResponse> {
  
    const team = await this.teamRepository.findOne({
      where: { id: idTeam },
    })


    if (team.idMembers.includes(idNewMember) || idNewMember == team.idCreator) {//se verifica que no se ingrese como miembro al creador del team
      return { success: false, message: "member already exists in team" };
    }
    //agregar el nuevo miembro al team
    team.idMembers.push(idNewMember)
    await this.teamRepository.save(team);
    return { success: true, message: "new member was added into team", idTeam: team.id };
  }

  async getTeams(id: number): Promise<Team[]>{
    return this.teamRepository.find({where: {idCreator: id}});
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }
  
  async findTeamsById(findTeamsById: findTeamsByIdInput): Promise<Team[]>{
    const idCreator = findTeamsById.idCreator;
    return this.teamRepository.find({
      where: {idCreator: idCreator
      }
    })

  }
  async findTeamsByMemberId(idMember: number): Promise<Team[]> {
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .where(':idMember = ANY(team.idMembers)', { idMember })
      .getMany();

    return teams;
  }
  async findOne(id: number) {
    try {
      const team = await this.teamRepository.findOne({ where: { id } });

      if (!team) {
        throw new Error('Equipo no encontrado');
      }

     // Crear un array con el ID del miembro (puede ser un solo elemento)
    const idMembersArray = Array.isArray(team.idMembers) ? team.idMembers : [team.idMembers];

    // Realizar llamadas a la API para obtener información de los miembros
    const membersInfoPromises = idMembersArray.map((id) =>
      axios.get(`${process.env.ENDPOINT_MS_AUTH}/get-user/${id}`)
    );

    // Esperar a que todas las llamadas a la API se completen
    const membersInfoResponses = await Promise.all(membersInfoPromises);

    // Extraer la información de los miembros de las respuestas
    const membersInfo = membersInfoResponses.map((res) => res.data);

    // Devolver el equipo y la información de los miembros
    return { team, membersInfo };
  } catch (error) {
    // Manejar errores aquí
    console.error('Error al buscar el equipo:', error.message);
    throw new Error('Error al buscar el equipo');
  }

  }
  async updateTeam(
    id: number,
    name: string,
    description: string,
  ): Promise<boolean> {
    try {
      await this.teamRepository.update(
        {
          id: id,
        },
        {
          name: name,
          description: description,
        },
      );
      return true;
    } catch (err) {
      return false;
    }
  }


  async remove(id: number): Promise<boolean> {
    const team = await this.teamRepository.findOne({where: {id}})
    console.log(team)
    if(team){
      console.log("antes de eliminar team")
      await this.teamRepository.remove(team)
      return true
    }
    return false
  }

  async deleteMember(idTeam: number, idMember: number): Promise<boolean> {
    const team = await this.teamRepository.findOne({where: {id: idTeam}})
    if(team){
      const index = team.idMembers.indexOf(idMember)
      if(index > -1){
        team.idMembers.splice(index, 1)
        await this.teamRepository.save(team)
        return true
      }
    }
    return false
  }

  async getTeamByName(name: string): Promise<Team> {

    const team =  await this.teamRepository.findOne({ where: { name } });

    return team;
  }
}
