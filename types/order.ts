import { OrderStatus } from "@/constants/enums";

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  priceAtOrderTime: number;
}

export interface OrderGroup {
  id: string;
  studentUid: string;
  totalAmount: number;
  createdAt: Date;
}

export interface VendorOrder {
  id: string;
  orderGroupId: string;
  studentUid: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  status: OrderStatus;
  rejectionReason?: string;
  createdAt: Date;
  acceptedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
}
