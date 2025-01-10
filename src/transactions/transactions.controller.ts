import { Controller, Post, Body, Param, Get } from '@nestjs/common'; 
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post(':expediteurTelephone')
  async create(  // Ajout de async
    @Param('expediteurTelephone') expediteurTelephone: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(expediteurTelephone, createTransactionDto);
  }

  @Get()
  async findAll() {
    return await this.transactionsService.findAll();
  }

  @Get('user/:telephone')
  async findByUser(@Param('telephone') telephone: string) {
    return await this.transactionsService.findByUser(telephone);
  }
}