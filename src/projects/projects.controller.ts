import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {findProjectByIdInput} from './dto/input-project'
import {Project, CreateProjectResponse, AddTeamResponse } from './entities/project.entity'
import { AddTeamDto } from './dto/add-team-dto';
import axios from "axios";
import { TeamsService } from 'src/teams/teams.service';
import { Team } from 'src/teams/entities/team.entity';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly teamsService: TeamsService,
  ) {}

  @Post('createProject')
  create(@Body() createProjectDto: CreateProjectDto):Promise<CreateProjectResponse> {
    try{
      return this.projectsService.create(createProjectDto);
    }catch(error){
      return Promise.resolve({ success: false, message: "Error creating team" });
    }
  }

  @Post('addTeam')
  async addTeam(@Body() addMemberDto: AddTeamDto): Promise<AddTeamResponse>{

    const nameNewTeam = addMemberDto.nameNewTeam
    const idProject = addMemberDto.idProject
    const team = await this.teamsService.getTeamByName(nameNewTeam);


      
      if( team.name === nameNewTeam){
          console.log("entro al if team es valido");        
          //agregar el nuevo miembro al team
          const idNewTeam = team.id
          return this.projectsService.addTeam(idProject,idNewTeam);
      }else{
          console.log("entro al else");
          return { success: false, message: "error in addMember" };
      }
  }

  @Post('findProjectsById')
  findProjectsById(@Body() findProjectsById: findProjectByIdInput) {
    return this.projectsService.findProjectsById(findProjectsById);
  }

  @Post('findProjectsByMemberId')
  findProjectsByMemberId(@Body() findProjectsById: findProjectByIdInput) {
    const idMember = findProjectsById.idCreator;
    return this.projectsService.findProjectsByMemberId(idMember);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  

  @Post('remove-project/:id')
  remove(@Param('id') id: number) {
    
    return this.projectsService.remove(id);

  }
}
