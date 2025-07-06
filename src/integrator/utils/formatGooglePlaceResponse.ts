import { Place } from "../interfaces/place.interface";

export function formatGooglePlaceResponse(places: Place[]) {
  return places.map(place => ({
    id: place.id,
    name: place.displayName.text,
    rating: place.rating,
    language: place.displayName.languageCode,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
    address: place.shortFormattedAddress,
    types: place.types,
  }));
}