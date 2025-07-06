import { IntegratorService } from './integrator.service';
import { getNearbyRestaurants } from './http/getNearbyRestaurants';
import { formatGooglePlaceResponse } from './utils/formatGooglePlaceResponse';
import { Place } from './interfaces/place.interface';

const mockPlacesResponse = {
  places: [
    {
      id: 'ChIJD7SzFqEpRI4R5GYACWawAoo',
      displayName: {
        text: 'Café Torbellino',
        languageCode: 'es',
      },
      location: {
        latitude: 6.2403844,
        longitude: -75.582501,
      },
      rating: 4.6,
      shortFormattedAddress: 'Cra. 64B #34-20, Laureles - Estadio, Medellín',
      types: ['coffee_shop', 'restaurant'],
    },
  ],
};

jest.mock('./http/getNearbyRestaurants');
jest.mock('./utils/formatGooglePlaceResponse');

describe('IntegratorService', () => {
  let service: IntegratorService;

  beforeEach(() => {
    service = new IntegratorService();
  });

  it('should return formatted nearby restaurants', async () => {
    const latitude = 6.24;
    const longitude = -75.58;
    const radius = 1000;
    const limit = 5;

    const mockRawPlaces = mockPlacesResponse.places as Place[];

    const expectedFormatted = mockRawPlaces.map((place) => ({
      id: place.id,
      name: place.displayName.text,
      rating: place.rating,
      language: place.displayName.languageCode,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      address: place.shortFormattedAddress,
      types: place.types,
    }));

    (getNearbyRestaurants as jest.Mock).mockResolvedValue({
      places: mockRawPlaces,
    });
    (formatGooglePlaceResponse as jest.Mock).mockReturnValue(expectedFormatted);

    const result = await service.getNearbyRestaurants(
      latitude,
      longitude,
      radius,
      limit,
    );

    expect(getNearbyRestaurants).toHaveBeenCalledWith(
      latitude,
      longitude,
      radius,
      limit,
    );
    expect(formatGooglePlaceResponse).toHaveBeenCalledWith(mockRawPlaces);
    expect(result).toEqual(expectedFormatted);
  });
});
