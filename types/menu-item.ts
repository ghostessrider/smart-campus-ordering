export interface MenuItem {
  id: string;
  vendorId: string;
  category?: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  image?: string;
  imageURL?: string;
  avgPrepTime?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}