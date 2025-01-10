import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':telephone/qrcode')
  async getQRCode(@Param('telephone') telephone: string) {
    return await this.usersService.getQRCode(telephone);
  }

  @Get(':telephone/solde')
  async getSolde(@Param('telephone') telephone: string) {
    return await this.usersService.getUserBalance(telephone);
  }

  @Get(':telephone/transactions')
  async getTransactions(@Param('telephone') telephone: string) {
    return await this.usersService.getTransactionHistory(telephone);
  }

  @Post(':telephone/pin')
  async updatePin(
    @Param('telephone') telephone: string,
    @Body() updatePinDto: { oldPin: string; newPin: string }
  ) {
    return await this.usersService.updatePin(telephone, updatePinDto.oldPin, updatePinDto.newPin);
  }
}