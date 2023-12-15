import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, CreateTaskResponse } from './entities/task.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { Project } from 'src/projects/entities/project.entity';


@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    
    private projectsService: ProjectsService,
  ) { }
  
  async create(createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    console.log("en service de create task");
    const name = createTaskDto.name;
    const emailCreator = createTaskDto.emailCreator;
    const idProject = createTaskDto.idProject;
    const task = await this.taskRepository.findOne({
      where: { name }
    })

    if (task) {//the task already exists
      return { success: false, message: 'Task already exists' };
    }

    //save task in database
    const newTask = this.taskRepository.create(
      createTaskDto,
    )

    await this.taskRepository.save(newTask);
    //hacerle saber a la tabla de proyectos que tiene una nueva tarea
    const newTaskId = newTask.id;
    
    
    //const response = /addTaskToProject`, { idProject, newTaskId })
    const response = await this.projectsService.addTaskToProject(idProject, newTaskId);
    return response
    
    //console.log("print response de la llamada a project", response);
    /*if((await response).success === false){
      throw new Error("Error al agregar la tarea al proyecto")
    } */
    //return { success: true, message: "Task created successfully"};
  }

  async findAll(): Promise<Task[]> {

    return this.taskRepository.find();
  }

  findOne(id: number) {
    try{
      const task = this.taskRepository.findOne({where: {id}})
      if(!task){
        throw new Error("tarea no encontrada");
      }
      return task;
    }catch (error) {
      // Manejar errores aquí
      console.error('Error al buscar el equipo:', error.message);
      throw new Error('Error al buscar el equipo');
}
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const taskToUpdate = await this.taskRepository.findOne({
      where: { id }, // Condición de búsqueda por ID
    });
    if (!taskToUpdate) {
      throw new Error(`No se encontró la tarea con el ID: ${id}`);
    }
   
    Object.assign(taskToUpdate, updateTaskDto); // Actualizar los campos proporcionados en el DTO

    return this.taskRepository.save(taskToUpdate);
  }

  /*remove(id: number) {
    return `This action removes a #${id} task`;
  }*/
  async remove(idTask: number, idProject: number): Promise<boolean> {
    console.log(idTask)
    const task = await this.taskRepository.findOne({where:  {id: idTask} });
    console.log(task)
    if(task){
      console.log("antes de eliminar task")
      await this.projectsService.deleteTask(idProject, task.id)
      await this.taskRepository.remove(task)
      
      return true
    }
    return false
  }
}
