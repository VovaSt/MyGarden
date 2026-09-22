import { ConflictException } from '@nestjs/common';
import { GardensService } from '../gardens/gardens.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpeciesService } from '../species/species.service';
import { TreesService } from './trees.service';

describe('TreesService', () => {
  const prisma = {
    tree: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;
  const gardensService = { findOne: jest.fn() } as unknown as GardensService;
  const speciesService = { findOne: jest.fn() } as unknown as SpeciesService;
  const service = new TreesService(prisma, gardensService, speciesService);
  const garden = { widthMeters: { toString: () => '10' }, heightMeters: { toString: () => '8' } };

  beforeEach(() => jest.clearAllMocks());

  it('does not create a tree outside the garden dimensions', async () => {
    (gardensService.findOne as jest.Mock).mockResolvedValue(garden);
    (speciesService.findOne as jest.Mock).mockResolvedValue({ id: 'species-id' });

    await expect(
      service.create('garden-id', { speciesId: 'species-id', label: 'Tree 1', x: 10.01, y: 8 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates a tree after checking its garden and species', async () => {
    (gardensService.findOne as jest.Mock).mockResolvedValue(garden);
    (speciesService.findOne as jest.Mock).mockResolvedValue({ id: 'species-id' });
    (prisma.tree.create as jest.Mock).mockResolvedValue({ id: 'tree-id' });

    await service.create('garden-id', { speciesId: 'species-id', label: 'Tree 1', x: 5, y: 4 });

    expect(prisma.tree.create).toHaveBeenCalledWith({
      data: { gardenId: 'garden-id', speciesId: 'species-id', label: 'Tree 1', x: 5, y: 4, plantingDate: undefined },
      include: { species: true },
    });
  });
});
