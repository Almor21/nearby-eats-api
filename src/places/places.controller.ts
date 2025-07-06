import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { FindNearbyRestaurantsDto } from './dtos/findNearbyRestaurant.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('nearby-restaurants')
  async findNearbyRestaurants(@Query() data: FindNearbyRestaurantsDto) {
    return await this.placesService.findNearbyRestaurants(data);
  }
}
