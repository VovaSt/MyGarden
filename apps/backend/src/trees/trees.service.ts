import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GardensService } from '../gardens/gardens.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpeciesService } from '../species/species.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { MoveTreeDto } from './dto/move-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';

@Injectable()
export class TreesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gardensService: GardensService,
    private readonly speciesService: SpeciesService,
  ) {}

  async create(gardenId: string, createTreeDto: CreateTreeDto) {
    const garden = await this.gardensService.findOne(gardenId);
    await this.speciesService.findOne(createTreeDto.speciesId);
    this.assertWithinGarden(createTreeDto.x, createTreeDto.y, garden);

    return this.prisma.tree.create({
      data: {
        gardenId,
        ...createTreeDto,
        plantingDate: createTreeDto.plantingDate ? new Date(createTreeDto.plantingDate) : undefined,
      },
      include: { species: true },
    });
  }

  async findAllByGarden(gardenId: string) {
    await this.gardensService.findOne(gardenId);
    return this.prisma.tree.findMany({
      where: { gardenId },
      include: { species: true, _count: { select: { grafts: true } } },
      orderBy: { label: 'asc' },
    });
  }

  async findOne(id: string) {
    const tree = await this.prisma.tree.findUnique({
      where: { id },
      include: {
        garden: true,
        species: true,
        grafts: { include: { variety: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    if (!tree) {
      throw new NotFoundException(`Tree ${id} was not found`);
    }

    return tree;
  }

  async move(id: string, moveTreeDto: MoveTreeDto) {
    const tree = await this.findOne(id);
    this.assertWithinGarden(moveTreeDto.x, moveTreeDto.y, tree.garden);

    return this.prisma.tree.update({ where: { id }, data: moveTreeDto });
  }

  async update(id: string, updateTreeDto: UpdateTreeDto) {
    const tree = await this.findOne(id);

    if (updateTreeDto.speciesId && updateTreeDto.speciesId !== tree.speciesId) {
      await this.speciesService.findOne(updateTreeDto.speciesId);
    }

    this.assertWithinGarden(updateTreeDto.x ?? Number(tree.x), updateTreeDto.y ?? Number(tree.y), tree.garden);

    try {
      return await this.prisma.tree.update({
        where: { id },
        data: {
          ...updateTreeDto,
          plantingDate: updateTreeDto.plantingDate ? new Date(updateTreeDto.plantingDate) : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException('A tree with grafts cannot change species');
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.tree.delete({ where: { id } });
  }

  private assertWithinGarden(
    x: number,
    y: number,
    garden: { widthMeters: Prisma.Decimal; heightMeters: Prisma.Decimal },
  ): void {
    if (x > Number(garden.widthMeters) || y > Number(garden.heightMeters)) {
      throw new ConflictException('Tree coordinates must be within the garden dimensions');
    }
  }
}
