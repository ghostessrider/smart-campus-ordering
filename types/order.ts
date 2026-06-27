import { OrderStatus } from "@/constants/enums";

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderGroup {
  id: string;
  userId: string;
  total: number;
  createdAt: Date;
}

export interface VendorOrder {
  id: string;
  userId: string;
  vendorId: string;
  orderNumber?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus?: string;
  paymentUTR?: string | null;
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  acceptedAt?: Date | null;
  preparingAt?: Date | null;
  readyAt?: Date | null;
  completedAt?: Date | null;
  deliveredAt?: Date | null;
}