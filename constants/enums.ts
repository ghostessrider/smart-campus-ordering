export type UserRole =
  | "student"
  | "vendor"
  | "admin";

// Confirmed schema change (signed off) — expanded from the original 4-stage
// pending/accepted/completed/delivered to the 7-value flow from the
// key-decisions doc: PLACED, ACCEPTED, PREPARING, READY_FOR_PICKUP,
// COMPLETED, REJECTED, CANCELLED. Kept lowercase to match this enum's
// existing convention; "pending" is used instead of "placed" since that
// was already the live value used everywhere in the codebase before this
// change — renaming pending->placed would break every existing query and
// document, which is exactly what the schema rules say not to do.
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "completed"
  | "delivered"
  | "rejected"
  | "cancelled";

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