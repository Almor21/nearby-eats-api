import { Controller, Get } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Nolog } from 'src/decorators/nolog.decorator';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Nolog()
  @Get()
  async getAllLogs() {
    return await this.logsService.getAllLogs();
  }
}
