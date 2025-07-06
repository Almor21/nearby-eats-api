import { Injectable } from '@nestjs/common';
import { getNearbyRestaurants } from './http/getNearbyRestaurants';
import { formatGooglePlaceResponse } from './utils/formatGooglePlaceResponse';

@Injectable()
export class IntegratorService {
  async getNearbyRestaurants(latitude: number, longitude: number) {
    const data = await getNearbyRestaurants(latitude, longitude);

    return formatGooglePlaceResponse(data.places);
  }
}
