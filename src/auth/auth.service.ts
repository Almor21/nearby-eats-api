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
import { JwtBlacklist } from 'src/database/entities/jwt-blacklist.entity';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(JwtBlacklist)
    private readonly jwtBlacklist: Repository<JwtBlacklist>,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
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

    const token = await this.tokenService.generateToken(user);

    return { token };
  }

  async logout(token: string) {
    const { jti, exp } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET', ''),
    });

    const revokedToken = this.jwtBlacklist.create({
      id: jti,
      token,
      expiresAt: new Date(exp * 1000),
    });

    await this.jwtBlacklist.save(revokedToken);
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
