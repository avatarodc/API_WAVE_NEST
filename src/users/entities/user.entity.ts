import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Contact } from '../../contacts/entities/contact.entity';

@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nom: string;

  @Column({ type: 'varchar' })
  prenom: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  telephone: string;

  @Column({ type: 'varchar' })
  pin: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  solde: number;

  @Column({ type: 'varchar', default: 'Actif' })
  statut: string;

  @Column({ type: 'varchar', default: 'Client' })
  role: string;

  @OneToMany(() => Transaction, transaction => transaction.expediteur)
  transactionsEnvoyees: Transaction[];

  @OneToMany(() => Transaction, transaction => transaction.destinataire)
  transactionsRecues: Transaction[];

  @OneToMany(() => Contact, contact => contact.utilisateur)
  contacts: Contact[];
}

