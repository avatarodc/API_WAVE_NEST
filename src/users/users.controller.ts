import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully.',
      data,
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully.',
      data,
    };
  }

  @Get(':telephone/qrcode')
  async getQRCode(@Param('telephone') telephone: string) {
    const data = await this.usersService.getQRCode(telephone);
    return {
      message: `QR code for user with telephone ${telephone} retrieved successfully.`,
      data,
    };
  }

  @Get(':telephone/solde')
  async getSolde(@Param('telephone') telephone: string) {
    const data = await this.usersService.getUserBalance(telephone);
    return {
      message: `Balance for user with telephone ${telephone} retrieved successfully.`,
      data,
    };
  }

  @Get(':telephone/transactions')
  async getTransactions(@Param('telephone') telephone: string) {
    const data = await this.usersService.getTransactionHistory(telephone);
    return {
      message: `Transaction history for user with telephone ${telephone} retrieved successfully.`,
      data,
    };
  }

  @Post(':telephone/pin')
  async updatePin(
    @Param('telephone') telephone: string,
    @Body() updatePinDto: { oldPin: string; newPin: string }
  ) {
    const data = await this.usersService.updatePin(
      telephone,
      updatePinDto.oldPin,
      updatePinDto.newPin,
    );
    return {
      message: 'Pin updated successfully.',
      data,
    };
  }
}
