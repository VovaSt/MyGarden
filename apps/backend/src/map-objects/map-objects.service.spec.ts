import { ConflictException } from '@nestjs/common';
import { MapReferenceObjectType } from '@prisma/client';
import { GardensService } from '../gardens/gardens.service';
import { PrismaService } from '../prisma/prisma.service';
import { MapObjectsService } from './map-objects.service';

describe('MapObjectsService', () => {
  const prisma = {
    mapReferenceObject: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
  } as unknown as PrismaService;
  const gardensService = { findOne: jest.fn() } as unknown as GardensService;
  const service = new MapObjectsService(prisma, gardensService);

  beforeEach(() => jest.clearAllMocks());

  it('rejects a building extending beyond the garden boundary', async () => {
    (gardensService.findOne as jest.Mock).mockResolvedValue({
      widthMeters: { toString: () => '10' },
      heightMeters: { toString: () => '8' },
    });

    await expect(
      service.create('garden-id', {
        type: MapReferenceObjectType.BUILDING,
        x: 9,
        y: 1,
        widthMeters: 2,
        heightMeters: 2,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
