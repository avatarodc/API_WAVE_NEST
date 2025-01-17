import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nom: string;

  @Column({ type: 'varchar' })
  telephone: string;

  @Column({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.contacts)
  @JoinColumn({ name: 'utilisateurId' }) // Correspond à la colonne dans la base
  utilisateur: User;
}
