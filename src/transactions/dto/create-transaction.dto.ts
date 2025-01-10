import { IsString, IsNumber, Min, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[0-9]+$/, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres' })
  destinataireTelephone: string;

  @IsNumber()
  @Min(1)
  montant: number;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^[0-9]+$/, { message: 'Le PIN doit contenir uniquement des chiffres' })
  pin: string;
}