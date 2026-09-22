import { IsOptional, IsString, Length } from 'class-validator';

export class CreateSpeciesDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(1, 180)
  scientificName?: string;
}
