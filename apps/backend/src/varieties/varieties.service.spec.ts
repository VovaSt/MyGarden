import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SpeciesService } from '../species/species.service';
import { VarietiesService } from './varieties.service';

describe('VarietiesService', () => {
  const prisma = {
    fruitVariety: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    varietySource: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;
  const speciesService = { findOne: jest.fn() } as unknown as SpeciesService;
  const service = new VarietiesService(prisma, speciesService);

  beforeEach(() => jest.clearAllMocks());

  it('checks the species before creating a variety', async () => {
    (speciesService.findOne as jest.Mock).mockResolvedValue({ id: 'species-id' });
    (prisma.fruitVariety.create as jest.Mock).mockResolvedValue({ id: 'variety-id' });

    await service.create({ name: 'Antonovka', speciesId: 'species-id' });

    expect(speciesService.findOne).toHaveBeenCalledWith('species-id');
  });

  it('returns not found for an unknown variety', async () => {
    (prisma.fruitVariety.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne('f9ff2985-9b5b-4c02-9bbe-4e7936e06fe8')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
