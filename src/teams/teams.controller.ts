import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { removeTeamDto } from './dto/remove-team.dto';
import { AddMemberDto } from './dto/add-member-dto';
import { AddMemberResponde, Team } from './entities/team.entity'
import { findTeamsByIdInput } from './dto/input-team';
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('createTeam')
  create(@Body() createTeamDto: CreateTeamDto) {
    try{
      return this.teamsService.create(createTeamDto);
    }catch(error){
      return { success: false, message: "error creating team"};
    }
  }

  @Post('addMember')
  addMember(@Body() addMemberDto: AddMemberDto): Promise<AddMemberResponde>{
    return this.teamsService.addMember(addMemberDto)
  }

  @Get('get-teams')
  getTeams(@Param('id') id: number): Promise<Team[]> {
    return this.teamsService.getTeams(id);
  }

  @Post('findTeamsById')
  findTeamsById(@Body() findTeamsById: findTeamsByIdInput) {
    return this.teamsService.findTeamsById(findTeamsById);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
}
