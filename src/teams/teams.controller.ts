import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member-dto';
import { AddMemberResponde } from './entities/team.entity'
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


  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
