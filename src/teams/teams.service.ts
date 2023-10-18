import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team, TeamResponde } from './entities/team.entity'
import { Repository } from 'typeorm';


@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
  ) { }

  async create(createTeamDto: CreateTeamDto): Promise<TeamResponde> {
    const name = createTeamDto.name;
    const team = await this.teamRepository.findOne({
      where: { name }
    })   
    
    if(team){//the team already exists
      return { success: false, message: 'Team already exists' };
    }

    //save team in database
    this.teamRepository.save(team);
    return { success: true, message: "Team created successfully"};

  }

  findAll() {
    return `This action returns all teams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
