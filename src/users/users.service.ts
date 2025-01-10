import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async generateQRCode(telephone: string): Promise<string> {
    const qrData = {
      telephone,
      timestamp: new Date().getTime()
    };
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      return qrCodeDataUrl;
    } catch (err) {
      console.error('Erreur lors de la génération du QR code:', err);
      throw err;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { telephone: createUserDto.telephone },
    });

    if (existingUser) {
      throw new ConflictException('Ce numéro de téléphone existe déjà');
    }

    const hashedPin = await bcrypt.hash(createUserDto.pin, 10);
    const qrCode = await this.generateQRCode(createUserDto.telephone);

    const user = this.usersRepository.create({
      ...createUserDto,
      pin: hashedPin,
      qrCode: qrCode
    });

    return this.usersRepository.save(user);
  }

  async findByTelephone(telephone: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { telephone },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async verifyPin(user: User, pin: string): Promise<boolean> {
    return bcrypt.compare(pin, user.pin);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: ['id', 'telephone', 'nom', 'solde', 'createdAt', 'qrCode']
    });
  }

  async updateSolde(telephone: string, montant: number): Promise<User> {
    const user = await this.findByTelephone(telephone);
    user.solde = Number(user.solde) + Number(montant);
    return await this.usersRepository.save(user);
  }

  async getQRCode(telephone: string): Promise<string> {
    const user = await this.findByTelephone(telephone);
    if (!user.qrCode) {
      user.qrCode = await this.generateQRCode(telephone);
      await this.usersRepository.save(user);
    }
    return user.qrCode;
  }

  async getTransactionHistory(telephone: string): Promise<any[]> {
    const user = await this.usersRepository.findOne({
      where: { telephone },
      relations: ['transactionsEnvoyees', 'transactionsRecues']
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const envoyees = user.transactionsEnvoyees.map(t => ({
      ...t,
      type: 'ENVOI'
    }));

    const recues = user.transactionsRecues.map(t => ({
      ...t,
      type: 'RECEPTION'
    }));

    return [...envoyees, ...recues].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async updatePin(telephone: string, oldPin: string, newPin: string): Promise<boolean> {
    const user = await this.findByTelephone(telephone);
    const isValidPin = await this.verifyPin(user, oldPin);

    if (!isValidPin) {
      throw new ConflictException('Ancien PIN incorrect');
    }

    const hashedNewPin = await bcrypt.hash(newPin, 10);
    user.pin = hashedNewPin;
    await this.usersRepository.save(user);
    
    return true;
  }

  async getUserBalance(telephone: string): Promise<number> {
    const user = await this.findByTelephone(telephone);
    return Number(user.solde);
  }
}