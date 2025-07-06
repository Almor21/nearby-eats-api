import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Log } from 'src/database/entities/log.entity';
import { Repository, DeleteResult } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let logRepository: jest.Mocked<Repository<Log>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: getRepositoryToken(Log),
          useValue: createMock<Repository<Log>>(),
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    logRepository = module.get(getRepositoryToken(Log));
  });

  it('should delete logs older than 30 days', async () => {
    const mockResult: DeleteResult = { affected: 5, raw: [] };
    logRepository.delete.mockResolvedValue(mockResult);

    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await service.handleLogCleanup();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    expect(logRepository.delete).toHaveBeenCalledWith({
      createdAt: expect.any(Object),
    });

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Logs limpios: 5 registros eliminados'),
    );

    spy.mockRestore();
  });
});
