import { Type } from 'class-transformer';
import { GraftStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Length, Max, Min, Validate } from 'class-validator';
import { CompleteFieldsConstraint } from '../../shared/validation/complete-fields.validator';

const HARVEST_OVERRIDE_FIELDS = [
  'harvestStartMonthOverride',
  'harvestStartDayOverride',
  'harvestEndMonthOverride',
  'harvestEndDayOverride',
];

export class CreateGraftDto {
  @IsUUID()
  varietyId!: string;

  @IsOptional()
  @IsDateString()
  graftingDate?: string;

  @IsOptional()
  @IsEnum(GraftStatus)
  status?: GraftStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  @Validate(CompleteFieldsConstraint, [HARVEST_OVERRIDE_FIELDS])
  harvestStartMonthOverride?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  harvestStartDayOverride?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  harvestEndMonthOverride?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  harvestEndDayOverride?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  notes?: string;
}
