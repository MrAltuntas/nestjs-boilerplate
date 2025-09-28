import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { BaseRepository } from '../../common/base/base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoRepository extends BaseRepository<Todo> {
  constructor(prisma: PrismaService) {
    super(prisma, 'todo' as keyof PrismaService);
  }

  async findCompletedTodos(): Promise<Todo[]> {
    return this.findAll({
      where: { completed: true },
    });
  }
}
