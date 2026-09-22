import { Type } from 'class-transformer';
import { MapReferenceObjectType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Length, Max, Min, ValidateIf } from 'class-validator';

export class CreateMapObjectDto {
  @IsEnum(MapReferenceObjectType)
  type!: MapReferenceObjectType;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  label?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000)
  x!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000)
  y!: number;

  @ValidateIf((object: CreateMapObjectDto) => object.type === MapReferenceObjectType.BUILDING)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(10_000)
  widthMeters?: number;

  @ValidateIf((object: CreateMapObjectDto) => object.type === MapReferenceObjectType.BUILDING)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(10_000)
  heightMeters?: number;

  @ValidateIf((object: CreateMapObjectDto) => object.type === MapReferenceObjectType.FENCE)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000)
  endX?: number;

  @ValidateIf((object: CreateMapObjectDto) => object.type === MapReferenceObjectType.FENCE)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000)
  endY?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(359.99)
  rotationDegrees?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10_000)
  notes?: string;
}
