import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User} from 'src/users/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';



@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // Remplacez par une clé sécurisée
      signOptions: { expiresIn: '1h' }, // Expiration du token
    }),
    TypeOrmModule.forFeature([User]), // Charger le repository TypeORM
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
