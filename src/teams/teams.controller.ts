import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { removeMemberDto, removeTeamDto } from './dto/remove-team.dto';
import { AddMemberDto } from './dto/add-member-dto';
import { AddMemberResponse, CreateTeamResponse, Team } from './entities/team.entity'
import { findTeamsByIdInput } from './dto/input-team';
import * as dotenv from 'dotenv';
dotenv.config()
import axios from "axios";

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('createTeam')
  create(@Body() createTeamDto: CreateTeamDto):Promise<CreateTeamResponse> {
    try{
      return this.teamsService.create(createTeamDto);
    }catch(error){
      return Promise.resolve({ success: false, message: "Error creating team" });
    }
  }

  @Post('addMember')
  async addMember(@Body() addMemberDto: AddMemberDto): Promise<AddMemberResponse>{

    const emailNewMember = addMemberDto.emailNewMember;
    const idTeam = addMemberDto.idTeam;
    const userResponse = await axios.post(`${process.env.ENDPOINT_MS_AUTH}/get-user`, {
      email: emailNewMember,
      });
      const idNewMember = userResponse.data.id;
      if(userResponse.data && userResponse.data.email === emailNewMember){
          console.log("entro al if usuario es valido");        
          //agregar el nuevo miembro al team
          return this.teamsService.addMember(idTeam,idNewMember);
      }else{
          console.log("entro al else");
          return { success: false, message: "error in addMember" };
      }
  }

  @Get('get-teams')
  getTeams(@Param('id') id: number): Promise<Team[]> {
    return this.teamsService.getTeams(id);
  }

  @Get('teams')
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Post('findTeamsById')
  findTeamsById(@Body() findTeamsById: findTeamsByIdInput) {
    return this.teamsService.findTeamsById(findTeamsById);
  }

  @Post('findTeamsByMemberId')
  findTeamsByMemberId(@Body() findTeamsById: findTeamsByIdInput) {
    const idMember = findTeamsById.idCreator;
    return this.teamsService.findTeamsByMemberId(idMember);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log("id en backend", id)
    
    return this.teamsService.findOne(+id);
  }

  @Patch('update-team')
  update(@Body() input: UpdateTeamDto) {
    return this.teamsService.updateTeam(input.id, input.name, input.description);
  }

  @Post('remove-team/:id')
  remove(@Param('id') id: number) {
    console.log("id en remove-team:", id);
    return this.teamsService.remove(id);

  }

  @Post('deleteMember')
  deleteMember(@Body() removeTeamDto: removeMemberDto) {
    return this.teamsService.deleteMember(removeTeamDto.idTeam, removeTeamDto.idMember);
  }
}
