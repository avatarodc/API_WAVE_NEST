import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common'; 
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post(':expediteurTelephone')
  @UseGuards(JwtAuthGuard)
  async create(  // Ajout de async
    @Param('expediteurTelephone') expediteurTelephone: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(expediteurTelephone, createTransactionDto);
  }
  

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.transactionsService.findAll();
  }

  @Get('user/:telephone')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Param('telephone') telephone: string) {
    return await this.transactionsService.findByUser(telephone);
  }
}