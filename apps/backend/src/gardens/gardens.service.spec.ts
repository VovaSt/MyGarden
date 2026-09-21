import { NotFoundException } from '@nestjs/common';
import { GardensService } from './gardens.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GardensService', () => {
  const garden = {
    id: 'f9ff2985-9b5b-4c02-9bbe-4e7936e06fe8',
    name: 'Home garden',
  };
  const prisma = {
    garden: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;
  const service = new GardensService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('creates a garden with metric dimensions', async () => {
    (prisma.garden.create as jest.Mock).mockResolvedValue(garden);

    await expect(
      service.create({ name: 'Home garden', widthMeters: 20, heightMeters: 30 }),
    ).resolves.toEqual(garden);
    expect(prisma.garden.create).toHaveBeenCalledWith({
      data: { name: 'Home garden', widthMeters: 20, heightMeters: 30 },
    });
  });

  it('returns a not-found error for an unknown garden', async () => {
    (prisma.garden.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne(garden.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
