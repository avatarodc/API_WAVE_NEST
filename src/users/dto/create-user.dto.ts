import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  @Matches(/^[0-9]+$/, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres' })
  telephone: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^[0-9]+$/, { message: 'Le PIN doit contenir uniquement des chiffres' })
  pin: string;
}