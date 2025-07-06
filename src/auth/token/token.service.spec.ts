import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtBlacklist } from 'src/database/entities/jwt-blacklist.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { User } from 'src/database/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let blacklistRepository: jest.Mocked<Repository<JwtBlacklist>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: getRepositoryToken(JwtBlacklist),
          useValue: createMock<Repository<JwtBlacklist>>(),
        },
      ],
    }).compile();

    service = module.get(TokenService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    blacklistRepository = module.get(getRepositoryToken(JwtBlacklist));
  });

  describe('generateToken', () => {
    it('should generate a JWT with payload and config', async () => {
      const mockUser: User = {
        id: 'user-123',
        username: 'edinson',
      } as User;

      const mockToken = 'mocked.jwt.token';

      configService.get.mockImplementation((key: string, defaultValue?: any) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_EXPIRATION') return '2h';
        return defaultValue;
      });

      jwtService.sign.mockReturnValue(mockToken);

      const token = await service.generateToken(mockUser);

      expect(token).toBe(mockToken);
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUser.id,
          username: mockUser.username,
          jti: expect.any(String),
        }),
        {
          secret: 'test-secret',
          expiresIn: '2h',
        },
      );
    });
  });

  describe('verifyTokenBlackList', () => {
    it('should throw UnauthorizedException if token is in blacklist', async () => {
      const jti = 'revoked-id';
      const revoked = { id: jti } as JwtBlacklist;

      blacklistRepository.findOne.mockResolvedValue(revoked);

      await expect(service.verifyTokenBlackList(jti)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(blacklistRepository.findOne).toHaveBeenCalledWith({
        where: { id: jti },
      });
    });

    it('should return null if token is not in blacklist', async () => {
      const jti = 'valid-id';

      blacklistRepository.findOne.mockResolvedValue(null);

      const result = await service.verifyTokenBlackList(jti);

      expect(result).toBeNull();
      expect(blacklistRepository.findOne).toHaveBeenCalledWith({
        where: { id: jti },
      });
    });
  });
});
