import { IsOptional, IsString } from 'class-validator';

export class FilterContactsDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  numeroTelephone?: string;
}
