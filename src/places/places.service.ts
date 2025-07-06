import { Injectable } from '@nestjs/common';
import { IntegratorService } from 'src/integrator/integrator.service';
import { FindNearbyRestaurantsDto } from './dtos/findNearbyRestaurant.dto';

@Injectable()
export class PlacesService {
  constructor(private readonly integratorService: IntegratorService) {}

  async findNearbyRestaurants({latitude, longitude, radius, limit}: FindNearbyRestaurantsDto) {
    const nearbyRestaurants = await this.integratorService.getNearbyRestaurants(
      latitude,
      longitude,
      radius,
      limit
    );

    return nearbyRestaurants;
  }
}
