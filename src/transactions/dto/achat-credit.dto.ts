import { IsNotEmpty, IsString, IsNumber, Min, MinLength } from 'class-validator';

export class AchatCreditDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  destinataireTelephone: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  montant: number;
}
