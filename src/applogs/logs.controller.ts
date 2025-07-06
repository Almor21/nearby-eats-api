import { Controller, Get, Param } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Nolog } from 'src/decorators/nolog.decorator';
import { User } from 'src/decorators/user.decorator';
import { User as UserType } from 'src/database/entities/user.entity';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Nolog()
  @Get()
  async getAllLogs() {
    return await this.logsService.getAllLogs();
  }

  @Nolog()
  @Get('/me')
  async getLogByUserId(@User() user: UserType) {
    return await this.logsService.getLogByUserId(user.id);
  }
}
