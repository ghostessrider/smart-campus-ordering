export interface CartItem {
  itemId: string;
  itemName: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  price: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}
