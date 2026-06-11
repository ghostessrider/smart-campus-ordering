import {
  MenuChangeStatus,
  MenuChangeType,
} from "@/constants/enums";

export interface MenuChangeRequest {
  id: string;
  vendorId: string;
  storeId: string;
  changeType: MenuChangeType;
  targetId?: string;
  payload: Record<string, unknown>;
  status: MenuChangeStatus;
  reviewedBy?: string;
  reviewComment?: string;
  createdAt: Date;
  reviewedAt?: Date;
}
