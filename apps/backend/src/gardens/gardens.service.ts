import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GardensService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGardenDto: CreateGardenDto) {
    return this.prisma.garden.create({ data: createGardenDto });
  }

  findAll() {
    return this.prisma.garden.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async findOne(id: string) {
    const garden = await this.prisma.garden.findUnique({ where: { id } });

    if (!garden) {
      throw new NotFoundException(`Garden ${id} was not found`);
    }

    return garden;
  }

  async update(id: string, updateGardenDto: UpdateGardenDto) {
    await this.findOne(id);

    return this.prisma.garden.update({
      where: { id },
      data: updateGardenDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.garden.delete({ where: { id } });
  }
}
