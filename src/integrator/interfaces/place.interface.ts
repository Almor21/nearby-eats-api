export interface Place {
  id: string;
  types: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  displayName: {
    text: string;
    languageCode: string;
  };
  shortFormattedAddress: string;
}
