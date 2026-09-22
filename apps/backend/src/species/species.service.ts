import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';

@Injectable()
export class SpeciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpeciesDto: CreateSpeciesDto) {
    try {
      return await this.prisma.fruitSpecies.create({ data: createSpeciesDto });
    } catch (error) {
      this.rethrowKnownDatabaseError(error);
    }
  }

  findAll() {
    return this.prisma.fruitSpecies.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const species = await this.prisma.fruitSpecies.findUnique({ where: { id } });

    if (!species) {
      throw new NotFoundException(`Species ${id} was not found`);
    }

    return species;
  }

  async update(id: string, updateSpeciesDto: UpdateSpeciesDto) {
    await this.findOne(id);

    try {
      return await this.prisma.fruitSpecies.update({ where: { id }, data: updateSpeciesDto });
    } catch (error) {
      this.rethrowKnownDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    try {
      await this.prisma.fruitSpecies.delete({ where: { id } });
    } catch (error) {
      this.rethrowKnownDatabaseError(error);
    }
  }

  private rethrowKnownDatabaseError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('A species with this name already exists');
      }

      if (error.code === 'P2003') {
        throw new ConflictException('A species used by trees or varieties cannot be deleted');
      }
    }

    throw error;
  }
}
