import { Test, TestingModule } from '@nestjs/testing';
import { JwtCleanupService } from './jwt-cleanup.service';
import { JwtBlacklist } from 'src/database/entities/jwt-blacklist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, LessThan } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';

describe('JwtCleanupService', () => {
  let service: JwtCleanupService;
  let repository: jest.Mocked<Repository<JwtBlacklist>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtCleanupService,
        {
          provide: getRepositoryToken(JwtBlacklist),
          useValue: createMock<Repository<JwtBlacklist>>(),
        },
      ],
    }).compile();

    service = module.get<JwtCleanupService>(JwtCleanupService);
    repository = module.get(getRepositoryToken(JwtBlacklist));
  });

  describe('handleCleanup', () => {
    it('should delete expired tokens', async () => {
      const mockDeleteResult: DeleteResult = {
        raw: [],
        affected: 2,
      };

      repository.delete.mockResolvedValue(mockDeleteResult);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.handleCleanup();

      expect(repository.delete).toHaveBeenCalledWith({
        expiresAt: expect.any(Object),
      });

      expect(consoleSpy).toHaveBeenCalledWith('JWT blacklist cleaned');

      consoleSpy.mockRestore();
    });
  });
});
