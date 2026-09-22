import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MapReferenceObjectType, Prisma } from '@prisma/client';
import { GardensService } from '../gardens/gardens.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMapObjectDto } from './dto/create-map-object.dto';
import { UpdateMapObjectDto } from './dto/update-map-object.dto';

@Injectable()
export class MapObjectsService {
  constructor(private readonly prisma: PrismaService, private readonly gardensService: GardensService) {}

  async create(gardenId: string, dto: CreateMapObjectDto) {
    const garden = await this.gardensService.findOne(gardenId);
    this.assertGeometryWithinGarden(dto, garden);
    return this.prisma.mapReferenceObject.create({ data: { gardenId, ...dto } });
  }

  async findAllByGarden(gardenId: string) {
    await this.gardensService.findOne(gardenId);
    return this.prisma.mapReferenceObject.findMany({ where: { gardenId }, orderBy: { createdAt: 'asc' } });
  }

  async update(id: string, dto: UpdateMapObjectDto) {
    const object = await this.findOne(id);
    const merged: CreateMapObjectDto = {
      type: dto.type ?? object.type,
      x: dto.x ?? Number(object.x),
      y: dto.y ?? Number(object.y),
      widthMeters: dto.widthMeters ?? (object.widthMeters ? Number(object.widthMeters) : undefined),
      heightMeters: dto.heightMeters ?? (object.heightMeters ? Number(object.heightMeters) : undefined),
      endX: dto.endX ?? (object.endX ? Number(object.endX) : undefined),
      endY: dto.endY ?? (object.endY ? Number(object.endY) : undefined),
      rotationDegrees: dto.rotationDegrees ?? (object.rotationDegrees ? Number(object.rotationDegrees) : undefined),
    };
    this.assertGeometryWithinGarden(merged, object.garden);
    return this.prisma.mapReferenceObject.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.mapReferenceObject.delete({ where: { id } });
  }

  private async findOne(id: string) {
    const object = await this.prisma.mapReferenceObject.findUnique({ where: { id }, include: { garden: true } });
    if (!object) throw new NotFoundException(`Map object ${id} was not found`);
    return object;
  }

  private assertGeometryWithinGarden(
    object: CreateMapObjectDto,
    garden: { widthMeters: Prisma.Decimal; heightMeters: Prisma.Decimal },
  ): void {
    const width = Number(garden.widthMeters);
    const height = Number(garden.heightMeters);
    const isBuilding = object.type === MapReferenceObjectType.BUILDING;
    const maxX = isBuilding ? object.x + (object.widthMeters ?? 0) : object.endX ?? object.x;
    const maxY = isBuilding ? object.y + (object.heightMeters ?? 0) : object.endY ?? object.y;

    if (maxX > width || maxY > height) {
      throw new ConflictException('Map object geometry must be within the garden dimensions');
    }
  }
}
