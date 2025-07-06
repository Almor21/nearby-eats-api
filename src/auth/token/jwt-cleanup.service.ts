import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtBlacklist } from 'src/database/entities/jwt-blacklist.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class JwtCleanupService {
  constructor(
    @InjectRepository(JwtBlacklist)
    private readonly jwtBlacklistRepository: Repository<JwtBlacklist>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    const now = new Date();

    const result = await this.jwtBlacklistRepository.delete({
      expiresAt: LessThan(now),
    });

    console.log('JWT blacklist cleaned');
  }
}
