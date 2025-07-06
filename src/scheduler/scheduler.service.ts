import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/database/entities/log.entity';
import { LessThan } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleLogCleanup() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const result = await this.logRepository.delete({
      createdAt: LessThan(cutoffDate),
    });

    console.log(`Logs limpios: ${result.affected} registros eliminados`);
  }
}
