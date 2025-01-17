import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
    private usersService: UsersService,
  ) {}

  async create(createContactDto: CreateContactDto, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const existingContact = await this.contactsRepository.findOne({
      where: {
        utilisateur: { id: userId },
        telephone: createContactDto.telephone,
      },
    });

    if (existingContact) {
      throw new BadRequestException('Ce contact existe déjà dans votre liste');
    }

    const contact = this.contactsRepository.create({
      ...createContactDto,
      utilisateur: user,
    });

    return await this.contactsRepository.save(contact);
  }

  async findAll(userId: string) {
    return await this.contactsRepository.find({
      where: { utilisateur: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTelephone(userId: string, telephone: string) {
    const contact = await this.contactsRepository.findOne({
      where: {
        utilisateur: { id: userId },
        telephone: telephone,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact non trouvé');
    }

    return contact;
  }

  async remove(userId: string, telephone: string) {
    const contact = await this.findByTelephone(userId, telephone);
    await this.contactsRepository.remove(contact);
    return contact;
  }
}
