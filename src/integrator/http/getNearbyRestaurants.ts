import axios from 'axios';
import { integratorConfig } from 'src/integrator/config/integratorConfig';
import { PlaceApiResponse } from '../interfaces/place.interface';

export const getNearbyRestaurants = async (
  latitude: number,
  longitude: number,
) => {
  const response = await axios.post<PlaceApiResponse>(
    integratorConfig.googlePlacesApiUrl,
    {
      includedTypes: integratorConfig.includedTypes,
      maxResultCount: integratorConfig.maxResultCount,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: integratorConfig.radius,
        },
      },
    },
    {
      headers: {
        ['X-Goog-Api-Key']: integratorConfig.googlePlacesApiKey,
        ['X-Goog-FieldMask']: integratorConfig.fieldsMask,
      },
    },
  );

  return response.data;
};
