import { Injectable } from '@nestjs/common';
import { GraftStatus } from '@prisma/client';
import { GardensService } from '../gardens/gardens.service';
import { PrismaService } from '../prisma/prisma.service';
import { HarvestCalendarQueryDto } from './dto/harvest-calendar-query.dto';

type HarvestWindow = {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  adjustedForGraft: boolean;
};

@Injectable()
export class HarvestCalendarService {
  constructor(private readonly prisma: PrismaService, private readonly gardensService: GardensService) {}

  async getCalendar(query: HarvestCalendarQueryDto) {
    await this.gardensService.findOne(query.gardenId);

    const grafts = await this.prisma.graft.findMany({
      where: {
        status: GraftStatus.ACTIVE,
        ...(query.varietyId ? { varietyId: query.varietyId } : {}),
        tree: {
          gardenId: query.gardenId,
          ...(query.treeId ? { id: query.treeId } : {}),
          ...(query.speciesId ? { speciesId: query.speciesId } : {}),
        },
      },
      include: {
        tree: { include: { species: true } },
        variety: true,
      },
    });

    return grafts
      .map((graft) => {
        const harvestWindow = this.getHarvestWindow(graft);
        if (!harvestWindow || (query.month && !this.isMonthInWindow(query.month, harvestWindow))) {
          return undefined;
        }

        return {
          graftId: graft.id,
          tree: {
            id: graft.tree.id,
            label: graft.tree.label,
            species: { id: graft.tree.species.id, name: graft.tree.species.name },
          },
          variety: { id: graft.variety.id, name: graft.variety.name },
          approximateHarvestPeriod: harvestWindow,
          typicalStorage: {
            daysMin: graft.variety.typicalStorageDaysMin,
            daysMax: graft.variety.typicalStorageDaysMax,
            conditions: graft.variety.storageConditions,
          },
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
      .sort((left, right) =>
        left.approximateHarvestPeriod.startMonth - right.approximateHarvestPeriod.startMonth ||
        left.approximateHarvestPeriod.startDay - right.approximateHarvestPeriod.startDay ||
        left.tree.label.localeCompare(right.tree.label) ||
        left.variety.name.localeCompare(right.variety.name),
      );
  }

  private getHarvestWindow(graft: {
    harvestStartMonthOverride: number | null;
    harvestStartDayOverride: number | null;
    harvestEndMonthOverride: number | null;
    harvestEndDayOverride: number | null;
    variety: {
      harvestStartMonth: number | null;
      harvestStartDay: number | null;
      harvestEndMonth: number | null;
      harvestEndDay: number | null;
    };
  }): HarvestWindow | undefined {
    const adjustedForGraft = graft.harvestStartMonthOverride !== null;
    const startMonth = graft.harvestStartMonthOverride ?? graft.variety.harvestStartMonth;
    const startDay = graft.harvestStartDayOverride ?? graft.variety.harvestStartDay;
    const endMonth = graft.harvestEndMonthOverride ?? graft.variety.harvestEndMonth;
    const endDay = graft.harvestEndDayOverride ?? graft.variety.harvestEndDay;

    if (startMonth === null || startDay === null || endMonth === null || endDay === null) {
      return undefined;
    }

    return { startMonth, startDay, endMonth, endDay, adjustedForGraft };
  }

  private isMonthInWindow(month: number, window: HarvestWindow): boolean {
    return window.startMonth <= window.endMonth
      ? month >= window.startMonth && month <= window.endMonth
      : month >= window.startMonth || month <= window.endMonth;
  }
}
