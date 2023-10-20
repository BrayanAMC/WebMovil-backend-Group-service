import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member-dto'
import { InjectRepository } from '@nestjs/typeorm';
import { Team, CreateTeamResponde, AddMemberResponde } from './entities/team.entity'
import { Repository } from 'typeorm';


@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
  ) { }

  async create(createTeamDto: CreateTeamDto): Promise<CreateTeamResponde> {
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

  async addMember(addMemberDto: AddMemberDto): Promise<AddMemberResponde> {
    const idMember = addMemberDto.idMember;
    const nameTeam = addMemberDto.nameTeam;
    const idCreator = addMemberDto.idCreator;
    //verificar que exista el team y que el creador del team sea idCreator
    const team = await this.teamRepository.findOne({
      where: { name: nameTeam, idCreator }
    })
    if (!team) {
      return { success: false, message: "team does not exist" };
    }

    if (team.idMembers.includes(idMember) || idMember == team.idCreator) {//se verifica que no se ingrese como miembro al creador del team
      return { success: false, message: "member already exists in team" };
    }
    //agregar el nuevo miembro al team
    team.idMembers.push(idMember)
    await this.teamRepository.save(team);
    return { success: true, message: "new member was added into team", idTeam: team.id };
  }

  findAll(): Promise<Team[]>{
    return this.teamRepository.find();
  }

  findOne(id: number) {
    return this.teamRepository.findOne({where:{id}});
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
