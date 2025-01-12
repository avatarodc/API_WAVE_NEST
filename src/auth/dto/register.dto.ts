import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;


  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  @MinLength(4)
  pin: string;

  @IsString()  // Ajoutez un validateur pour le téléphone
  telephone: string;
}
