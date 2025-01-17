import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByTelephone(registerDto.telephone);
    if (existingUser) {
      throw new ConflictException('Ce numéro de téléphone est déjà utilisé.');
    }

    const hashedPin = await bcrypt.hash(registerDto.pin, 10);

    const createUserDto: CreateUserDto = {
      nom: registerDto.nom,
      prenom: registerDto.prenom,
      email: registerDto.email,
      telephone: registerDto.telephone,
      pin: hashedPin,
    };

    const user = await this.usersService.create(createUserDto);

    return { 
      message: 'Utilisateur enregistré avec succès.', 
      user: { ...user, pin: undefined },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByTelephone(loginDto.telephone);
  
    const invalidMessage = 'Identifiants invalides';
    if (!user || !(await bcrypt.compare(loginDto.pin, user.pin))) {
      throw new UnauthorizedException(invalidMessage);
    }
  
    const payload = { sub: user.id, telephone: user.telephone };
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, pin: undefined },
    };
  }
}

