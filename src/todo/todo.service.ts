import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '../../generated/prisma';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.prisma.todo.create({
      data: createTodoDto,
    });
  }

  async findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      return this.prisma.todo.update({
        where: { id },
        data: updateTodoDto,
      });
    } catch {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
  }

  async replace(id: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    await this.findOne(id); // Varlığını kontrol et

    return this.prisma.todo.update({
      where: { id },
      data: {
        ...createTodoDto,
        completed: false, // PUT işleminde completed'ı sıfırla
      },
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.todo.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }
  }

  async findCompleted(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: { completed: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findPending(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: { completed: false },
      orderBy: { createdAt: 'desc' },
    });
  }
}
