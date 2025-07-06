export const integratorConfig = {
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
  googlePlacesApiUrl: process.env.GOOGLE_PLACES_API_URL || '',
  fieldsMask: [
    'places.id',
    'places.displayName',
    'places.location',
    'places.types',
    'places.shortFormattedAddress',
    'places.rating',
  ].join(','),
  maxResultCount: 10,
  includedTypes: ['restaurant'],
  radius: 500.0,
};
