import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, CreateTaskResponse } from './entities/task.entity';
import { ProjectsService } from 'src/projects/projects.service';


@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,

    private readonly projectsService: ProjectsService,
  ) { }
  
  async create(createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    const name = createTaskDto.name;
    const idCreator = createTaskDto.idCreator;
    const task = await this.taskRepository.findOne({
      where: { name}
    })

    if (task) {//the task already exists
      return { success: false, message: 'Task already exists' };
    }

    //save task in database
    const newTask = this.taskRepository.create(
      createTaskDto,
    )

    await this.taskRepository.save(newTask);
    return { success: true, message: "Task created successfully", idTask: newTask.id };
  }

  async findAll(): Promise<Task[]> {

    return this.taskRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
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


  async remove(id: number): Promise<boolean> {
    const task = await this.taskRepository.findOne({where: {id}})
    console.log(task)
    if(task){
      console.log("antes de eliminar task")
      await this.taskRepository.remove(task)
      return true
    }
    return false
  }
}
