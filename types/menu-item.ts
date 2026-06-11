export interface MenuItem {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  peripherals: string[];
  imageUrl: string;
  price: number;
  prepTime: number;
  availability: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
