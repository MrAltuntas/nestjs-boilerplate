import { PrismaService } from '../../Modules/prisma/prisma.service';

export interface FindAllParams {
  skip?: number;
  take?: number;
  where?: object;
  orderBy?: object;
  include?: object;
}

export abstract class BaseRepository<T> {
  protected model: any; // Prisma model instance

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: keyof PrismaService,
  ) {
    this.model = this.prisma[modelName];
  }

  async findAll(params?: FindAllParams): Promise<T[]> {
    return await this.model.findMany({
      ...params,
      where: {
        ...params?.where,
        deletedAt: null,
      },
    });
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return await this.model.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<T> {
    return await this.model.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async count(where?: object): Promise<number> {
    return await this.model.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
