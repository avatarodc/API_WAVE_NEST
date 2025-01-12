// src/transactions/dto/create-transaction.dto.ts
import { IsString, IsNumber, IsNotEmpty, Length, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  destinataireTelephone: string;

  @IsNumber()
  @Min(100)
  montant: number;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  pin: string;

  @IsString()
  description?: string;
}
