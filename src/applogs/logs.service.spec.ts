import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Log } from 'src/database/entities/log.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { v4 as uuidv4 } from 'uuid';

describe('LogsService', () => {
  let service: LogsService;
  let repository: jest.Mocked<Repository<Log>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getRepositoryToken(Log),
          useValue: createMock<Repository<Log>>(),
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    repository = module.get(getRepositoryToken(Log));
  });

  describe('getAllLogs', () => {
    it('should return all logs', async () => {
      const logs: Log[] = [
        {
          id: 'uuid-1',
          userId: 'user-1',
          route: '/api/example',
          body: { foo: 'bar' },
          response: { ok: true },
          method: 'GET',
          statusCode: 200,
          createdAt: new Date(),
        },
      ];

      repository.find.mockResolvedValue(logs);

      const result = await service.getAllLogs();

      expect(result).toEqual(logs);
    });
  });

  describe('createLog', () => {
    it('should create and save a log', async () => {
      const logData: Partial<Log> = {
        route: '/api/create',
        body: { name: 'test' },
        response: { status: 'ok' },
        method: 'POST',
        statusCode: 201,
      };

      const createdLog: Log = {
        id: 'uuid-2',
        ...logData,
        createdAt: new Date(),
      } as Log;

      repository.create.mockReturnValue(createdLog);
      repository.save.mockResolvedValue(createdLog);

      const result = await service.createLog(logData);

      expect(repository.create).toHaveBeenCalledWith(logData);
      expect(repository.save).toHaveBeenCalledWith(createdLog);
      expect(result).toEqual(createdLog);
    });
  });
});
