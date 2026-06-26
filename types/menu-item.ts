export interface MenuItem {
  id: string;
  vendorId: string;
  category?: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}