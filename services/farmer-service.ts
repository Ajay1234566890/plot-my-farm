import { MOCK_FARMERS } from '@/utils/mock-data';

export interface Farmer {
  id: number;
  name: string;
  distance: string;
  image: string;
}

class FarmerService {
  async getNearbyFarmers(): Promise<Farmer[]> {
    // In a real app, this would fetch data from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_FARMERS.slice(0, 3));
      }, 500);
    });
  }
}

export const farmerService = new FarmerService();
