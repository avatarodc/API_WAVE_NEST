import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  telephone: string;

  @Column()
  nom: string;

  @Column()
  @Exclude()
  pin: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  solde: number;

  @Column({ nullable: true })
  qrCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.expediteur)
  transactionsEnvoyees: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.destinataire)
  transactionsRecues: Transaction[];
}