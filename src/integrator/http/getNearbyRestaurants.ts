import axios from 'axios';
import { PlaceApiResponse } from '../interfaces/placesResponse.interface';
import { integratorConfig } from '../config/integratorConfig';

export const getNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  radius?: number,
  limit?: number,
) => {
  const response = await axios.post<PlaceApiResponse>(
    integratorConfig.googlePlacesApiUrl,
    {
      includedTypes: radius || integratorConfig.includedTypes,
      maxResultCount: limit || integratorConfig.maxResultCount,
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
