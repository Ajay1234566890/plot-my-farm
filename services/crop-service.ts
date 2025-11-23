import { MOCK_CROPS } from '@/utils/mock-data';

export interface Crop {
  id: number;
  name: string;
  farmer: string;
  price: string;
  image: string;
}

class CropService {
  async getFeaturedCrops(): Promise<Crop[]> {
    // In a real app, this would fetch data from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CROPS);
      }, 500);
    });
  }
}

export const cropService = new CropService();
