import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly utilisateurRepository: Repository<User>, // Utilisation de TypeORM
  ) {}

  // Fonction d'inscription
  async register(data: { email: string; pin: string; nom: string; prenom: string ,telephone:string}) {
    const hashedPin = await bcrypt.hash(data.pin, 10);
  
    // Créez une instance de l'utilisateur avec les bonnes propriétés
    const user = this.utilisateurRepository.create({
      email: data.email,
      pin: hashedPin,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      statut: 'Actif', // Valeur par défaut
      role: 'Client', // Valeur par défaut
    });
  
    // Sauvegarder l'utilisateur dans la base de données
    await this.utilisateurRepository.save(user);
  
    return {
      message: 'Inscription réussie',
      user,
    };
  }
  

  // Fonction de connexion
  async login(telephone: string, pin: string) {
    // Recherche de l'utilisateur par téléphone
    const user = await this.utilisateurRepository.findOne({ where: { telephone } });
  
    // Vérification que l'utilisateur existe
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');
  
    // Vérification que le champ pin de l'utilisateur est défini
    if (!user.pin) throw new UnauthorizedException('Aucun PIN trouvé pour cet utilisateur');
  
    // Comparaison du PIN fourni avec celui stocké (crypté) dans la base de données
    const isMatch = await bcrypt.compare(pin, user.pin); // Comparaison entre le pin texte brut et le hash
    if (!isMatch) throw new UnauthorizedException('PIN incorrect');
  
    // Génération du JWT
    const payload = { id: user.id, telephone: user.telephone, role: user.role };
    const token = this.jwtService.sign(payload);
  
    // Retour de l'utilisateur et du token
    return {
      access_token: token,
      user,
    };
  }
  
  
  
}
