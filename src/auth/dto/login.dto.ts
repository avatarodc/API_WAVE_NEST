import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 15)
  @Matches(/^[0-9]+$/, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres' })
  telephone: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^[0-9]{4}$/, { message: 'Le PIN doit contenir exactement 4 chiffres' })
  pin: string;
}

