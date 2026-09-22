import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { CompleteFieldsConstraint } from '../../shared/validation/complete-fields.validator';

const HARVEST_FIELDS = ['harvestStartMonth', 'harvestStartDay', 'harvestEndMonth', 'harvestEndDay'];
const STORAGE_FIELDS = ['typicalStorageDaysMin', 'typicalStorageDaysMax'];

export class CreateVarietyDto {
  @IsUUID()
  speciesId!: string;

  @IsString()
  @Length(1, 180)
  name!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @Length(1, 180, { each: true })
  aliases?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  @Validate(CompleteFieldsConstraint, [HARVEST_FIELDS])
  harvestStartMonth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  harvestStartDay?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  harvestEndMonth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  harvestEndDay?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Validate(CompleteFieldsConstraint, [STORAGE_FIELDS])
  typicalStorageDaysMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  typicalStorageDaysMax?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  storageConditions?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  notes?: string;
}
