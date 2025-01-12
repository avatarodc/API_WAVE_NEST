import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.transactionsEnvoyees)
  expediteur: User;

  @ManyToOne(() => User, user => user.transactionsRecues)
  destinataire: User;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  montant: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  frais: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  date: Date;
}