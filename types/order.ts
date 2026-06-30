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
  // Firestore Timestamp or JavaScript Date
  createdAt: Date | any;
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
  // Firestore Timestamp or JavaScript Date
  createdAt: Date | any;
  updatedAt?: Date | any;
  acceptedAt?: Date | any;
  completedAt?: Date | any;
  deliveredAt?: Date | any;
}