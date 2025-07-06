import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { JwtBlacklist } from 'src/database/entities/jwt-blacklist.entity';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token/token.service';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let blacklistRepo: jest.Mocked<Repository<JwtBlacklist>>;
  let configService: jest.Mocked<ConfigService>;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(JwtBlacklist),
          useValue: createMock<Repository<JwtBlacklist>>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: TokenService,
          useValue: createMock<TokenService>(),
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    blacklistRepo = module.get(getRepositoryToken(JwtBlacklist));
    configService = module.get(ConfigService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    tokenService = module.get(TokenService);
  });

  describe('login', () => {
    const username = 'edinson';
    const password = 'test123';

    it('should throw if user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.login({ username, password })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if password is invalid', async () => {
      userRepo.findOne.mockResolvedValue({ id: '1', username, password: 'hash' } as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ username, password })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a token if credentials are valid', async () => {
      const user = { id: '1', username, password: 'hashed' } as User;

      userRepo.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      tokenService.generateToken.mockResolvedValue('jwt-token');

      const result = await service.login({ username, password });

      expect(result).toEqual({ token: 'jwt-token' });
    });
  });

  describe('logout', () => {
    it('should store the revoked token in the blacklist', async () => {
      const token = 'fake.jwt.token';
      const payload = {
        jti: 'token-id',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      jwtService.verify.mockReturnValue(payload);
      configService.get.mockReturnValue('secret');
      const mockRevoked = { id: payload.jti, token, expiresAt: new Date(payload.exp * 1000), createdAt: new Date() } as JwtBlacklist;

      blacklistRepo.create.mockReturnValue(mockRevoked);
      blacklistRepo.save.mockResolvedValue(mockRevoked);

      await service.logout(token);

      expect(blacklistRepo.create).toHaveBeenCalledWith({
        id: payload.jti,
        token,
        expiresAt: new Date(payload.exp * 1000),
      });

      expect(blacklistRepo.save).toHaveBeenCalledWith(mockRevoked);
    });
  });

  describe('signUp', () => {
    const signUpData = {
      email: 'test@mail.com',
      username: 'edinson',
      password: '123456',
      firstName: 'Edinson',
      lastName: 'Noriega'
    };

    it('should throw if email or username already exists', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'user-1' } as User);

      await expect(service.signUp(signUpData)).rejects.toThrow(BadRequestException);
    });

    it('should create user if data is valid', async () => {
      userRepo.findOne.mockResolvedValue(null);
      configService.get.mockReturnValue('10');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const expectedUser = {
        email: signUpData.email,
        username: signUpData.username,
        password: 'hashed-password',
        firstName: 'Edinson',
        lastName: 'Noriega',
      };

      usersService.create.mockResolvedValue(expectedUser as any);

      const result = await service.signUp(signUpData);

      expect(result).toEqual(expectedUser);
      expect(usersService.create).toHaveBeenCalledWith(expectedUser);
    });
  });

  describe('validateUser', () => {
    it('should throw if user is not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.validateUser('user-123')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user if found', async () => {
      const user = { id: 'user-123', username: 'edinson' } as User;

      userRepo.findOne.mockResolvedValue(user);

      const result = await service.validateUser('user-123');

      expect(result).toEqual(user);
    });
  });
});
