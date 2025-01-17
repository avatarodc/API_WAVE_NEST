import { Controller, Get, Post, Delete, Body, UseGuards, Request, Param, HttpStatus } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto, @Request() req) {
    try {
      const contact = await this.contactsService.create(createContactDto, req.user.id);
      return {
        statusCode: HttpStatus.CREATED,
        code: 'ok',
        data: contact,
        message: 'Contact créé avec succès',
      };
    } catch (error) {
      throw error; // Laisse l'exception passer si quelque chose échoue
    }
  }

  @Get()
  async findAll(@Request() req) {
    try {
      const contacts = await this.contactsService.findAll(req.user.id);
      return {
        statusCode: HttpStatus.OK,
        code: 'ok',
        data: contacts,
        message: 'Contacts récupérés avec succès',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':telephone')
  async findOne(@Param('telephone') telephone: string, @Request() req) {
    try {
      const contact = await this.contactsService.findByTelephone(req.user.id, telephone);
      return {
        statusCode: HttpStatus.OK,
        code: 'ok',
        data: contact,
        message: 'Contact récupéré avec succès',
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':telephone')
  async remove(@Param('telephone') telephone: string, @Request() req) {
    try {
      const contact = await this.contactsService.remove(req.user.id, telephone);
      return {
        statusCode: HttpStatus.OK,
        code: 'ok',
        data: contact,
        message: 'Contact supprimé avec succès',
      };
    } catch (error) {
      throw error;
    }
  }
}
