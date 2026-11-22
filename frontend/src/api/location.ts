import { env } from '../config/env';

export interface LocationResult {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  display_name?: string;
}

export const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationResult | null> => {
  try {
    const url = `${env.nominatimApiUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data as LocationResult;
  } catch (error) {
    console.error('Error performing reverse geocoding:', error);
    return null;
  }
};

export default { reverseGeocode };
