// src/contacts/dto/create-contact.dto.ts
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[0-9]+$/, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres' })
  telephone: string;
}
