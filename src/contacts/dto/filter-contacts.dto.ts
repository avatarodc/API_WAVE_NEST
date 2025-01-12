import { IsString, IsOptional } from 'class-validator';

export class FilterContactsDto {
  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  telephone?: string;
}