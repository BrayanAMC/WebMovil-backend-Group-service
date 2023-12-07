import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, CreateTaskResponse } from './entities/task.entity';



@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,

  ) { }
  
  async create(createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    const name = createTaskDto.name;
    const idCreator = createTaskDto.idCreator;
    const task = await this.taskRepository.findOne({
      where: { name, idCreator }
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

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
