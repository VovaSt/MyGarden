import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SpeciesService } from './species.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SpeciesService', () => {
  const prisma = {
    fruitSpecies: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;
  const service = new SpeciesService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('lists species alphabetically', async () => {
    await service.findAll();

    expect(prisma.fruitSpecies.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
  });

  it('returns not found for an unknown species', async () => {
    (prisma.fruitSpecies.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne('f9ff2985-9b5b-4c02-9bbe-4e7936e06fe8')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('reports a duplicate species name as a conflict', async () => {
    (prisma.fruitSpecies.create as jest.Mock).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Duplicate species name', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.create({ name: 'Apple' })).rejects.toBeInstanceOf(ConflictException);
  });
});
