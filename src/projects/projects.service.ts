import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {findProjectByIdInput} from './dto/input-project'
import {Project, CreateProjectResponse, AddTeamResponse } from './entities/project.entity'

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<CreateProjectResponse> {
    const name = createProjectDto.name;
    const idCreator = createProjectDto.idCreator;
    const project = await this.projectRepository.findOne({
      where: { name, idCreator }
    })

    if (project) {//the team already exists
      return { success: false, message: 'Team already exists' };
    }

    //save project in database
    const newProject = this.projectRepository.create(
      createProjectDto,
    )
    await this.projectRepository.save(newProject);
    return { success: true, message: "Team created successfully", idTeam: newProject.id };

  }

  async findProjectsById(findProjectsById: findProjectByIdInput): Promise<Project[]>{
    const idCreator = findProjectsById.idCreator;
    return this.projectRepository.find({
      where: {idCreator}
    })

  }


  async findProjectsByMemberId(idMember: number): Promise<Project[]> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where(':idMember = ANY(project.idTeams)', { idMember })
      .getMany();

    return projects;
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  async remove(id: number): Promise<boolean> {
    const team = await this.projectRepository.findOne({where: {id}})
    console.log(team)
    if(team){
      console.log("antes de eliminar team")
      await this.projectRepository.remove(team)
      return true
    }
    return false
  }

  async addTeam(idProject: number, idNewTeam: number): Promise<AddTeamResponse> {
  
    const project = await this.projectRepository.findOne({
      where: { id: idProject },
    })

    if (project.idTeams.includes(idNewTeam)) {
      return { success: false, message: "team already exists in project" };
    }
    //agregar el nuevo miembro al team
    project.idTeams.push(idNewTeam)
    await this.projectRepository.save(project);
    return { success: true, message: "new team was added into team"};
  }
}
