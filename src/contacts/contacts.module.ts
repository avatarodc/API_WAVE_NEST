import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contact } from './entities/contact.entity';
import { UsersModule } from '../users/users.module'; // Importation correcte de UsersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    UsersModule, // Assurez-vous que UsersModule est bien importé
  ],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
