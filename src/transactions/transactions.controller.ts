import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransfertDto } from './dto/transfert.dto';
import { AchatCreditDto } from './dto/achat-credit.dto';

@Controller('api/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfert')
  async transfert(@Body() transfertDto: TransfertDto, @Request() req) {
    return this.transactionsService.transfert(transfertDto, req.user.id);
  }

  @Post('achat-credit')
  async achatCredit(@Body() achatCreditDto: AchatCreditDto, @Request() req) {
    return this.transactionsService.achatCredit(achatCreditDto, req.user.id);
  }

  @Get()
  async getUserTransactions(@Request() req) {
    return this.transactionsService.getUserTransactions(req.user.id);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string, @Request() req) {
    return this.transactionsService.deleteTransaction(id, req.user.id);
  }
}
