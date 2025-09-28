import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

export abstract class BaseService<T, CreateDto = object, UpdateDto = object> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationDto || {};

    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.repository.findAll({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder.toLowerCase(),
        },
      }),
      this.repository.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Resource with ID "${id}" not found`);
    }
    return entity;
  }

  async create(createDto: CreateDto): Promise<T> {
    return this.repository.create(createDto as Partial<T>);
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    await this.findOne(id); // Check exists
    return this.repository.update(id, updateDto as Partial<T>);
  }

  async remove(id: string): Promise<T> {
    await this.findOne(id); // Check exists
    return this.repository.delete(id);
  }

  async softDelete(id: string): Promise<T> {
    await this.findOne(id); // Check exists
    return this.repository.softDelete(id);
  }
}
