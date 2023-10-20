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


  @Get('teams')
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Patch('update-team')
  update(@Body() input: UpdateTeamDto) {
    return this.teamsService.updateTeam(input.id, input.name, input.description);
  }

  @Delete('remove-team')
  remove(@Body('id') id: number) {
    try{
      console.log(id)
      return this.teamsService.remove(id);
    }catch(error){
      return "an error has ocurred";
    }
  }
}
