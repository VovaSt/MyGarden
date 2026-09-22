import { GardensService } from '../gardens/gardens.service';
import { PrismaService } from '../prisma/prisma.service';
import { HarvestCalendarService } from './harvest-calendar.service';

describe('HarvestCalendarService', () => {
  const prisma = { graft: { findMany: jest.fn() } } as unknown as PrismaService;
  const gardensService = { findOne: jest.fn() } as unknown as GardensService;
  const service = new HarvestCalendarService(prisma, gardensService);

  beforeEach(() => jest.clearAllMocks());

  it('uses a graft override and filters by a month in a cross-year window', async () => {
    (gardensService.findOne as jest.Mock).mockResolvedValue({ id: 'garden-id' });
    (prisma.graft.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'graft-id',
        harvestStartMonthOverride: 12,
        harvestStartDayOverride: 20,
        harvestEndMonthOverride: 1,
        harvestEndDayOverride: 10,
        tree: { id: 'tree-id', label: 'Tree 1', species: { id: 'species-id', name: 'Apple' } },
        variety: {
          id: 'variety-id',
          name: 'Winter cultivar',
          harvestStartMonth: 9,
          harvestStartDay: 1,
          harvestEndMonth: 9,
          harvestEndDay: 20,
          typicalStorageDaysMin: 30,
          typicalStorageDaysMax: 60,
          storageConditions: null,
        },
      },
    ]);

    const events = await service.getCalendar({ gardenId: 'garden-id', month: 1 });

    expect(events).toHaveLength(1);
    expect(events[0].approximateHarvestPeriod).toEqual({
      startMonth: 12,
      startDay: 20,
      endMonth: 1,
      endDay: 10,
      adjustedForGraft: true,
    });
  });

  it('excludes varieties without an approximate harvest period', async () => {
    (gardensService.findOne as jest.Mock).mockResolvedValue({ id: 'garden-id' });
    (prisma.graft.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'graft-id',
        harvestStartMonthOverride: null,
        harvestStartDayOverride: null,
        harvestEndMonthOverride: null,
        harvestEndDayOverride: null,
        tree: { id: 'tree-id', label: 'Tree 1', species: { id: 'species-id', name: 'Apple' } },
        variety: {
          id: 'variety-id', name: 'Unknown cultivar', harvestStartMonth: null, harvestStartDay: null,
          harvestEndMonth: null, harvestEndDay: null, typicalStorageDaysMin: null,
          typicalStorageDaysMax: null, storageConditions: null,
        },
      },
    ]);

    await expect(service.getCalendar({ gardenId: 'garden-id' })).resolves.toEqual([]);
  });
});
