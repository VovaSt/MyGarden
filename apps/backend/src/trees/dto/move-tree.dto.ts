import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class MoveTreeDto {
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
}
