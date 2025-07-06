import { Module } from '@nestjs/common';
import { IntegratorService } from './integrator.service';

@Module({
  providers: [IntegratorService],
  exports: [IntegratorService],
})
export class IntegratorModule {}
