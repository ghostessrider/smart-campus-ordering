export type UserRole =
  | "student"
  | "vendor"
  | "admin";

export type OrderStatus =
  | "pending"
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
