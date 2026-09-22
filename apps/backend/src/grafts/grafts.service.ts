import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TreesService } from '../trees/trees.service';
import { VarietiesService } from '../varieties/varieties.service';
import { CreateGraftDto } from './dto/create-graft.dto';
import { UpdateGraftDto } from './dto/update-graft.dto';

@Injectable()
export class GraftsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly treesService: TreesService,
    private readonly varietiesService: VarietiesService,
  ) {}

  async create(treeId: string, createGraftDto: CreateGraftDto) {
    const [tree, variety] = await Promise.all([
      this.treesService.findOne(treeId),
      this.varietiesService.findOne(createGraftDto.varietyId),
    ]);

    if (tree.speciesId !== variety.speciesId) {
      throw new ConflictException('A graft variety must belong to the same species as its tree');
    }

    const { graftingDate, ...graftData } = createGraftDto;

    return this.prisma.graft.create({
      data: {
        treeId,
        speciesId: tree.speciesId,
        ...graftData,
        graftingDate: graftingDate ? new Date(graftingDate) : undefined,
      },
      include: { variety: true },
    });
  }

  async findAllByTree(treeId: string) {
    await this.treesService.findOne(treeId);
    return this.prisma.graft.findMany({
      where: { treeId },
      include: { variety: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, updateGraftDto: UpdateGraftDto) {
    await this.findOne(id);

    return this.prisma.graft.update({
      where: { id },
      data: {
        ...updateGraftDto,
        graftingDate: updateGraftDto.graftingDate ? new Date(updateGraftDto.graftingDate) : undefined,
      },
      include: { variety: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.graft.delete({ where: { id } });
  }

  private async findOne(id: string) {
    const graft = await this.prisma.graft.findUnique({ where: { id } });

    if (!graft) {
      throw new NotFoundException(`Graft ${id} was not found`);
    }

    return graft;
  }
}
