import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { findProjectByIdInput } from './dto/input-project';
import {
  Project,
  CreateProjectResponse,
  AddTeamResponse,
} from './entities/project.entity';
import { TeamsService } from 'src/teams/teams.service';
import { TasksService } from 'src/tasks/tasks.service';
import { Task } from 'src/tasks/entities/task.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly teamsService: TeamsService,
    //private readonly tasksService: TasksService,

  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<CreateProjectResponse> {
    const name = createProjectDto.name;
    const idCreator = createProjectDto.idCreator;
    const project = await this.projectRepository.findOne({
      where: { name, idCreator },
    });

    if (project) {
      //the team already exists
      return { success: false, message: 'Team already exists' };
      
    }

    //save project in database
    const newProject = this.projectRepository.create(createProjectDto);
    await this.projectRepository.save(newProject);
    return {
      success: true,
      message: 'Team created successfully',
      idProject: newProject.id,
    };
  }

  async findProjectsById(
    findProjectsById: findProjectByIdInput,
  ): Promise<Project[]> {
    const idCreator = findProjectsById.idCreator;
    return this.projectRepository.find({
      where: { idCreator },
    });
  }

  async addTaskToProject(idProject: number, idNewTask: number) {
    console.log(idProject, idNewTask);
    const project = await this.projectRepository.findOne({
      where: { id: idProject },
    });

    if (project.idTasks.includes(idNewTask)) {
      return { success: false, message: 'task already exists in project' };
    }
  
    project.idTasks.push(idNewTask);
    await this.projectRepository.save(project);
    return { success: true, message: 'new task was added into project' };


  }

  async findProjectsByTeamId(idTeam: number): Promise<Project[]> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where(':idTeam = ANY(project.idTeams)', { idTeam })
      .getMany();

    return projects;
  }

  async findOne(id: number) {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });

      if (!project) {
        throw new Error('Proyecto no encontrado');
      }

      const teams = await Promise.all(
        project.idTeams.map(async (idTeam) => {
          const team = await this.teamsService.findOne(idTeam);
          return team;
        }),
      );
      const tasks = await Promise.all(
        project.idTasks.map(async (idTask) => {
         
          
          const task = await this.taskRepository.findOne({ where: { id: idTask } });
          return task;
        }),
      );
      
      
      return { project, teams, tasks };
    } catch (error) {
      // Manejar errores aquí
      console.error('Error al buscar el proyecto:', error.message);
      throw new Error('Error al buscar el proyecto');
    }
  }

  async getListOfTasks(id: number) {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });

      if (!project) {
        throw new Error('Proyecto no encontrado');
      }

      const tasks = await Promise.all(
        project.idTasks.map(async (idTask) => {
          //const task = await this.tasksService.findOne(idTask);
          //return task;
        }),
      );

      return { tasks };
    } catch (error) {
      // Manejar errores aquí
      console.error('Error al buscar el la terea:', error.message);
      throw new Error('Error al buscar la tarea');
    }
  }

  async updateProject(
    id: number,
    name: string,
    description: string,
  ): Promise<boolean> {
    try {
      await this.projectRepository.update(
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
    const team = await this.projectRepository.findOne({ where: { id } });
    console.log(team);
    if (team) {
      console.log('antes de eliminar team');
      await this.projectRepository.remove(team);
      return true;
    }
    return false;
  }

  async addTeam(
    idProject: number,
    idNewTeam: number,
  ): Promise<AddTeamResponse> {
    const project = await this.projectRepository.findOne({
      where: { id: idProject },
    });

    if (project.idTeams.includes(idNewTeam)) {
      return { success: false, message: 'team already exists in project' };
    }
    //agregar el nuevo miembro al team
    project.idTeams.push(idNewTeam);
    await this.projectRepository.save(project);
    return { success: true, message: 'new team was added into team' };
  }

  async deleteTeam(idProject: number, idTeam: number): Promise<boolean> {
    const project = await this.projectRepository.findOne({where: {id: idProject}})
    if(project){
      const index = project.idTeams.indexOf(idTeam)
      if(index > -1){
        project.idTeams.splice(index, 1)
        await this.projectRepository.save(project)
        return true
      }
    }
    return false
  }
}
