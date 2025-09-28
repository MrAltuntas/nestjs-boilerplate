import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base/base.service';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService extends BaseService<
  Todo,
  CreateTodoDto,
  UpdateTodoDto
> {
  constructor(private readonly todoRepository: TodoRepository) {
    super(todoRepository);
  }

  async findCompleted(): Promise<Todo[]> {
    return this.todoRepository.findCompletedTodos();
  }

  async findPending(): Promise<Todo[]> {
    return this.todoRepository.findAll({
      where: { completed: false },
    });
  }

  async replace(id: string, createDto: CreateTodoDto): Promise<Todo> {
    await this.findOne(id);
    return this.todoRepository.update(
      id,
      createDto as unknown as Record<string, unknown>,
    );
  }
}
