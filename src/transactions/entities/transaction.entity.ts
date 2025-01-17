import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
  TRANSFERT = 'transfert',
  PAIEMENT = 'paiement',
  CREDIT = 'credit',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  montant: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  montant_frais: number;

  @Column({ type: 'timestamp', name: 'date_transaction', default: () => 'CURRENT_TIMESTAMP' })
  date_transaction: Date;

  @ManyToOne(() => User, (user) => user.transactionsEnvoyees, { eager: true })
  @JoinColumn({ name: 'expediteur_id' })
  expediteur: User;

  @ManyToOne(() => User, (user) => user.transactionsRecues, { eager: true })
  @JoinColumn({ name: 'destinataire_id' })
  destinataire: User;

  @Column({
    name: 'type_transaction',
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.TRANSFERT,
  })
  type: TransactionType;
}

