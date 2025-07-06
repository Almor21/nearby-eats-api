import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ username, password }: LoginDto) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET', ''),
        expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
      },
    );

    return { token };
  }

  async signUp(data: SignUpDto) {
    const { email, username, password, ...rest } = data;

    const userExists = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (userExists) {
      throw new BadRequestException('Email o username ya están en uso');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(this.configService.get('BCRYPT_SALT_ROUNDS', '10')),
    );

    return await this.usersService.create({
      email,
      username,
      password: hashedPassword,
      ...rest,
    });
  }

  async validateUser(id: string) {
    const user = this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('No autorizado');
    }

    return user;
  }
}
