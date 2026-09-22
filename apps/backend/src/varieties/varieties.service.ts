import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SpeciesService } from '../species/species.service';
import { CreateVarietyDto } from './dto/create-variety.dto';
import { CreateVarietySourceDto } from './dto/create-variety-source.dto';
import { UpdateVarietyDto } from './dto/update-variety.dto';

@Injectable()
export class VarietiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly speciesService: SpeciesService,
  ) {}

  async create(createVarietyDto: CreateVarietyDto) {
    await this.speciesService.findOne(createVarietyDto.speciesId);

    try {
      return await this.prisma.fruitVariety.create({ data: createVarietyDto });
    } catch (error) {
      this.rethrowKnownDatabaseError(error);
    }
  }

  findAll(speciesId?: string) {
    return this.prisma.fruitVariety.findMany({
      where: speciesId ? { speciesId } : undefined,
      include: { species: true },
      orderBy: [{ species: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const variety = await this.prisma.fruitVariety.findUnique({
      where: { id },
      include: { species: true, sources: { orderBy: { createdAt: 'asc' } } },
    });

    if (!variety) {
      throw new NotFoundException(`Variety ${id} was not found`);
    }

    return variety;
  }

  async update(id: string, updateVarietyDto: UpdateVarietyDto) {
    await this.findOne(id);

    try {
      return await this.prisma.fruitVariety.update({ where: { id }, data: updateVarietyDto });
    } catch (error) {
      this.rethrowKnownDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    try {
      await this.prisma.fruitVariety.delete({ where: { id } });
    } catch (error) {
      this.rethrowKnownDatabaseError(error);
    }
  }

  async findSources(varietyId: string) {
    await this.findOne(varietyId);
    return this.prisma.varietySource.findMany({ where: { varietyId }, orderBy: { createdAt: 'asc' } });
  }

  async createSource(varietyId: string, createVarietySourceDto: CreateVarietySourceDto) {
    await this.findOne(varietyId);
    return this.prisma.varietySource.create({
      data: {
        varietyId,
        ...createVarietySourceDto,
        retrievedAt: createVarietySourceDto.retrievedAt
          ? new Date(createVarietySourceDto.retrievedAt)
          : undefined,
      },
    });
  }

  async removeSource(sourceId: string): Promise<void> {
    const source = await this.prisma.varietySource.findUnique({ where: { id: sourceId } });

    if (!source) {
      throw new NotFoundException(`Variety source ${sourceId} was not found`);
    }

    await this.prisma.varietySource.delete({ where: { id: sourceId } });
  }

  private rethrowKnownDatabaseError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('A variety with this name already exists for this species');
      }

      if (error.code === 'P2003') {
        throw new ConflictException('A variety used by a graft cannot be deleted');
      }
    }

    throw error;
  }
}
