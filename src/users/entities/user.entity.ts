// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Exclude } from 'class-transformer';

@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ type: 'date', nullable: true })
  dateNaissance: Date;

  @Column({ default: 'Actif' })
  statut: 'Actif' | 'Inactif';

  @Column({ default: 'Client' })
  role: 'Client' | 'Agent';

  @Column()
  @Exclude()
  pin: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  solde: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 100000 })
  plafond: number;

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

  @OneToMany(() => Contact, (contact) => contact.utilisateur)
  contacts: Contact[];
}
