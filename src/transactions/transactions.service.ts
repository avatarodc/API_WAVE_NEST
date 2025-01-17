import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { TransfertDto } from './dto/transfert.dto';
import { AchatCreditDto } from './dto/achat-credit.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
  ) {}

  private calculateFrais(montant: number): number {
    return montant * 0.01; // 1% des frais
  }

  async transfert(transfertDto: TransfertDto, userId: string) {
    const expediteur = await this.usersService.findById(userId);
    if (!expediteur) {
      throw new NotFoundException('Expéditeur non trouvé');
    }

    const destinataire = await this.usersService.findByTelephone(transfertDto.destinataireTelephone);
    if (!destinataire) {
      throw new BadRequestException('Destinataire non trouvé');
    }

    const frais = this.calculateFrais(transfertDto.montant);
    const montantTotal = transfertDto.montant + frais;

    if (expediteur.solde < montantTotal) {
      throw new BadRequestException('Solde insuffisant pour couvrir le montant et les frais');
    }

    expediteur.solde -= montantTotal;
    destinataire.solde += transfertDto.montant;

    await Promise.all([
      this.usersService.updateUser(expediteur),
      this.usersService.updateUser(destinataire),
    ]);

    const transaction = this.transactionsRepository.create({
      expediteur,
      destinataire,
      montant: transfertDto.montant,
      montant_frais: frais,
      type: TransactionType.TRANSFERT,
    });

    await this.transactionsRepository.save(transaction);

    return {
      code: 'ok',
      data: {
        ...transaction,
        frais,
        montantTotal,
      },
      message: 'Transfert effectué avec succès',
    };
  }

  async achatCredit(achatCreditDto: AchatCreditDto, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const frais = this.calculateFrais(achatCreditDto.montant);
    const montantTotal = achatCreditDto.montant + frais;

    if (user.solde < montantTotal) {
      throw new BadRequestException('Solde insuffisant pour couvrir le montant et les frais');
    }

    user.solde -= montantTotal;
    await this.usersService.updateUser(user);

    const transaction = this.transactionsRepository.create({
      destinataire: user,
      montant: achatCreditDto.montant,
      montant_frais: frais,
      type: TransactionType.CREDIT,
    });

    await this.transactionsRepository.save(transaction);

    return {
      code: 'ok',
      data: {
        ...transaction,
        frais,
        montantTotal,
      },
      message: 'Achat de crédit effectué avec succès',
    };
  }

  async getUserTransactions(userId: string) {
    const transactions = await this.transactionsRepository.find({
      where: [
        { expediteur: { id: userId } },
        { destinataire: { id: userId } },
      ],
      order: { date_transaction: 'DESC' },
    });

    return {
      code: 'ok',
      data: transactions,
      message: 'Transactions récupérées avec succès',
    };
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['expediteur', 'destinataire'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    if (
      transaction.expediteur?.id !== userId &&
      transaction.destinataire?.id !== userId
    ) {
      throw new BadRequestException("Vous n'êtes pas autorisé à supprimer cette transaction");
    }

    await this.transactionsRepository.remove(transaction);

    return {
      code: 'ok',
      message: 'Transaction supprimée avec succès',
    };
  }
}

