export interface MenuItem {
  id: string;
  vendorId: string;
  category?: string;
  name: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
