import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member-dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Team, CreateTeamResponse, AddMemberResponse } from './entities/team.entity'
import { Repository } from 'typeorm';
import { findTeamsByIdInput } from './dto/input-team';

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

  async getTeamByName(name: string): Promise<Team> {
    
    const team =  await this.teamRepository.findOne({ where: { name } });
    
    return team;
  }

  async getTeams(id: number): Promise<Team[]>{
    return this.teamRepository.find({where: {idCreator: id}});
  }

  async findTeamsByMemberId(idMember: number): Promise<Team[]> {
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .where(':idMember = ANY(team.idMembers)', { idMember })
      .getMany();

    return teams;
  }

  async findTeamsById(findTeamsById: findTeamsByIdInput): Promise<Team[]>{
    const idCreator = findTeamsById.idCreator;
    return this.teamRepository.find({
      where: {idCreator}
    })

  }

  async findOne(id: number) {
    
    //TODO: ir con axios a el repo de los usuarios

    const team = await this.teamRepository.findOne({
      where: { id }
    });
    
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
}
