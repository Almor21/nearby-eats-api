import { PlacesService } from './places.service';
import { IntegratorService } from 'src/integrator/integrator.service';
import { FindNearbyRestaurantsDto } from './dtos/findNearbyRestaurant.dto';
import { createMock } from '@golevelup/ts-jest';

describe('PlacesService', () => {
  let placesService: PlacesService;
  let integratorService: jest.Mocked<IntegratorService>;

  beforeEach(() => {
    integratorService = createMock<IntegratorService>();
    placesService = new PlacesService(integratorService);
  });

  it('should return nearby restaurants from integratorService', async () => {
    const dto: FindNearbyRestaurantsDto = {
      latitude: 6.24,
      longitude: -75.58,
      radius: 1000,
      limit: 5,
    };

    const mockResult = [
      {
        id: 'abc123',
        name: 'Mock Restaurant',
        rating: 4.5,
        language: 'es',
        latitude: 6.24,
        longitude: -75.58,
        address: 'Calle falsa 123',
        types: ['restaurant'],
      },
    ];

    integratorService.getNearbyRestaurants.mockResolvedValue(mockResult);

    const result = await placesService.findNearbyRestaurants(dto);

    expect(integratorService.getNearbyRestaurants).toHaveBeenCalledWith(
      dto.latitude,
      dto.longitude,
      dto.radius,
      dto.limit,
    );

    expect(result).toEqual(mockResult);
  });
});
