// src/contacts/contacts.controller.ts
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactsDto } from './dto/filter-contacts.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post(':userTelephone')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('userTelephone') userTelephone: string,
    @Body() createContactDto: CreateContactDto
  ) {
    return await this.contactsService.create(userTelephone, createContactDto);
  }

  @Get(':userTelephone')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(
    @Param('userTelephone') userTelephone: string,
    @Query() filterDto: FilterContactsDto
  ) {
    return await this.contactsService.findAllByUser(userTelephone, filterDto);
  }

  @Get(':userTelephone/contact/:contactTelephone')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('userTelephone') userTelephone: string,
    @Param('contactTelephone') contactTelephone: string
  ) {
    return await this.contactsService.findOne(userTelephone, contactTelephone);
  }

  @Get(':userTelephone/verify/:contactTelephone')
  @UseGuards(JwtAuthGuard)
  async verifyContact(
    @Param('userTelephone') userTelephone: string,
    @Param('contactTelephone') contactTelephone: string
  ) {
    return await this.contactsService.verifyContactInUsers(userTelephone, contactTelephone);
  }
}