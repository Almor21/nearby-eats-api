import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { IntegratorModule } from 'src/integrator/integrator.module';

@Module({
  imports: [IntegratorModule],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
