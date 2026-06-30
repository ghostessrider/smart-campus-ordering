export type UserRole =
  | "student"
  | "vendor"
  | "admin";

// FINAL: confirmed 5 allowed order statuses (per Divyansh, 27 June) —
// pending, accepted, completed, delivered, rejected. No "preparing",
// "ready_for_pickup", or "cancelled" — those were added in error during
// an earlier pass and have been reverted everywhere.
export type OrderStatus =
  | "pending"
  | "pending_confirmation"
  | "accepted"
  | "completed"
  | "delivered"
  | "rejected";

export type MenuChangeType =
  | "CREATE_ITEM"
  | "UPDATE_ITEM"
  | "DELETE_ITEM"
  | "PRICE_CHANGE"
  | "CATEGORY_CREATE"
  | "CATEGORY_UPDATE"
  | "CATEGORY_DELETE";

export type MenuChangeStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";