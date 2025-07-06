import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/database/entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async getAllLogs() {
    return await this.logRepository.find();
  }

  async createLog(logData: Partial<Log>) {
    const log = this.logRepository.create(logData);
    return await this.logRepository.save(log);
  }
}
