import { IsNotEmpty, IsString, IsNumber, Min, Length, Matches, IsOptional } from 'class-validator';

export class TransfertDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 15)
  @Matches(/^[0-9]+$/, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres' })
  destinataireTelephone: string;

  @IsNumber()
  @Min(100)
  montant: number;

  @IsOptional()
  @IsString()
  description?: string;
}
