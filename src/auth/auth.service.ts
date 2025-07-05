import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async login({ username, password }: LoginDto) {}

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
}
