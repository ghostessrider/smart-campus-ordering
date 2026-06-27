/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum VendorStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DEACTIVATED = 'deactivated',
}

export enum FeedbackStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  URGENT = 'urgent',
  REPLIED = 'replied',
}

export enum TabType {
  VENDORS = 'vendors',
  VENDOR_REGISTRATION = 'vendor_registration',
  FEEDBACK = 'feedback',
  SETTINGS = 'settings',
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  vendorId: string;
  customerName: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}


export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  image: string;
  icon: string;
  rating: number;
  totalOrders: number;
  avgPrepTime: number;
  monthlyRevenue: number;
  satisfaction: number;
}

export interface FeedbackItem {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorImage: string;
  rating: number;
  orderNumber: string;
  text: string;
  timeAgo: string;
  customerId: string;
  status: FeedbackStatus;
  dateString: string;
  customerName: string;
  customerHandle: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface DashboardStats {
  totalVendors: number;
  activeOrders: number;
  totalFeedback: number;
  avgRating: number;
  pendingIssueCount: number;
  resolutionRate: number;
  avgResponseTime: string;
}
