import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TreesService } from '../trees/trees.service';
import { VarietiesService } from '../varieties/varieties.service';
import { GraftsService } from './grafts.service';

describe('GraftsService', () => {
  const prisma = {
    graft: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
  } as unknown as PrismaService;
  const treesService = { findOne: jest.fn() } as unknown as TreesService;
  const varietiesService = { findOne: jest.fn() } as unknown as VarietiesService;
  const service = new GraftsService(prisma, treesService, varietiesService);

  beforeEach(() => jest.clearAllMocks());

  it('rejects a variety whose species differs from the tree', async () => {
    (treesService.findOne as jest.Mock).mockResolvedValue({ speciesId: 'apple' });
    (varietiesService.findOne as jest.Mock).mockResolvedValue({ speciesId: 'pear' });

    await expect(service.create('tree-id', { varietyId: 'variety-id' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('stores the tree species with a valid graft', async () => {
    (treesService.findOne as jest.Mock).mockResolvedValue({ speciesId: 'apple' });
    (varietiesService.findOne as jest.Mock).mockResolvedValue({ speciesId: 'apple' });
    (prisma.graft.create as jest.Mock).mockResolvedValue({ id: 'graft-id' });

    await service.create('tree-id', { varietyId: 'variety-id' });

    expect(prisma.graft.create).toHaveBeenCalledWith({
      data: { treeId: 'tree-id', varietyId: 'variety-id', speciesId: 'apple', graftingDate: undefined },
      include: { variety: true },
    });
  });
});
