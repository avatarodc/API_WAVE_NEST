// src/transactions/transactions.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  private readonly FRAIS_POURCENTAGE = 0.01;

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  async create(expediteurTelephone: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const expediteur = await this.usersService.findByTelephone(expediteurTelephone);
    const destinataire = await this.usersService.findByTelephone(createTransactionDto.destinataireTelephone);

    const pinValid = await this.usersService.verifyPin(expediteur, createTransactionDto.pin);
    if (!pinValid) {
      throw new BadRequestException('PIN incorrect');
    }

    // Calcul des frais (1% du montant)
    const frais = createTransactionDto.montant * this.FRAIS_POURCENTAGE;
    const montantTotal = createTransactionDto.montant + frais;

    // Vérifier si l'expéditeur a assez d'argent (montant + frais)
    if (expediteur.solde < montantTotal) {
      throw new BadRequestException('Solde insuffisant pour couvrir le montant et les frais');
    }

    return await this.transactionsRepository.manager.transaction(async (transactionalEntityManager) => {
      // Mise à jour du solde de l'expéditeur
      expediteur.solde -= montantTotal;
      await transactionalEntityManager.save(User, expediteur);

      // Mise à jour du solde du destinataire
      destinataire.solde = Number(destinataire.solde) + Number(createTransactionDto.montant);
      await transactionalEntityManager.save(User, destinataire);

      // Création et sauvegarde de la transaction
      const transaction = this.transactionsRepository.create({
        expediteur,
        destinataire,
        montant: createTransactionDto.montant,
        frais: frais,
      });

      return await transactionalEntityManager.save(Transaction, transaction);
    });
  }

    // Lister toutes les transactions
  async findAll(): Promise<Transaction[]> {
    return await this.transactionsRepository.find({
      relations: ['expediteur', 'destinataire'],
      order: { date: 'DESC' },
    });
  }

  // Lister les transactions d'un utilisateur spécifique
  async findByUser(telephone: string): Promise<Transaction[]> {
    const user = await this.usersService.findByTelephone(telephone);
    
    return await this.transactionsRepository.find({
      where: [
        { expediteur: { id: user.id } },
        { destinataire: { id: user.id } }
      ],
      relations: ['expediteur', 'destinataire'],
      order: { date: 'DESC' },
    });
  }
}