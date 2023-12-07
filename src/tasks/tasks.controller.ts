import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('createTask')
  create(@Body() createTaskDto: CreateTaskDto) {
    try{
      return this.tasksService.create(createTaskDto);
    }catch(error){
      return Promise.resolve({ success: false, message: "Error creating task" });
    }
    
  }

  @Get('findAll')
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(+id, updateTaskDto);
  }

  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }*/

  @Post('remove-task/:id')
  remove(@Param('id') id: number) {
    console.log("id en remove-task:", id);
    return this.tasksService.remove(id);

  }
}
