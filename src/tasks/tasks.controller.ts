import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Task as TaskModel, TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  async getAll(): Promise<TaskModel[]> {
    return this.tasksService.tasks({});
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.tasksService.task({ id: Number(id) });
  }

  @Get('search-tasks/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<TaskModel[]> {
    return this.tasksService.tasks({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            description: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post()
  async createTask(
    @Body() taskData: { title: string; description?: string; email: string },
  ): Promise<TaskModel> {
    const { title, description, email } = taskData;
    return this.tasksService.createTask({
      title,
      description,
      status: TaskStatus.OPEN,
      user: {
        connect: { email: email },
      },
    });
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<TaskModel> {
    return this.tasksService.deleteTask({ id: Number(id) });
  }
}
