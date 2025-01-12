// src/contacts/contacts.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { User } from '../users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactsDto } from './dto/filter-contacts.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  async create(userTelephone: string, createContactDto: CreateContactDto): Promise<Contact> {
    const user = await this.usersService.findByTelephone(userTelephone);

    // Vérifier si le contact existe déjà pour cet utilisateur
    const existingContact = await this.contactsRepository.findOne({
      where: {
        utilisateur: { id: user.id },
        telephone: createContactDto.telephone,
      },
    });

    if (existingContact) {
      throw new ConflictException('Ce contact existe déjà');
    }

    const contact = this.contactsRepository.create({
      ...createContactDto,
      utilisateur: user,
    });

    return await this.contactsRepository.save(contact);
  }

  async findAllByUser(userTelephone: string, filterDto: FilterContactsDto): Promise<Contact[]> {
    const user = await this.usersService.findByTelephone(userTelephone);
    
    const queryBuilder = this.contactsRepository.createQueryBuilder('contact')
      .where('contact.utilisateur_id = :userId', { userId: user.id });

    if (filterDto.nom) {
      queryBuilder.andWhere('contact.nom ILIKE :nom', { nom: `%${filterDto.nom}%` });
    }

    if (filterDto.telephone) {
      queryBuilder.andWhere('contact.telephone LIKE :telephone', { telephone: `%${filterDto.telephone}%` });
    }

    return await queryBuilder
      .orderBy('contact.nom', 'ASC')
      .getMany();
  }

  async findOne(userTelephone: string, contactTelephone: string): Promise<Contact> {
    const user = await this.usersService.findByTelephone(userTelephone);
    
    const contact = await this.contactsRepository.findOne({
      where: {
        utilisateur: { id: user.id },
        telephone: contactTelephone,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact non trouvé');
    }

    return contact;
  }

  async verifyContactInUsers(userTelephone: string, contactTelephone: string): Promise<{
    exists: boolean;
    isUser: boolean;
    contact?: Contact;
    userData?: Partial<User>;
  }> {
    const user = await this.usersService.findByTelephone(userTelephone);
    
    // Vérifier si c'est un contact
    const contact = await this.contactsRepository.findOne({
      where: {
        utilisateur: { id: user.id },
        telephone: contactTelephone,
      },
    });

    // Vérifier si c'est un utilisateur de l'application
    const contactUser = await this.usersRepository.findOne({
      where: { telephone: contactTelephone },
      select: ['id', 'nom', 'prenom', 'telephone', 'email'] // Sélectionner uniquement les champs publics
    });

    return {
      exists: !!contact,
      isUser: !!contactUser,
      contact: contact || undefined,
      userData: contactUser || undefined,
    };
  }
}