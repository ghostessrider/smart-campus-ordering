import { UserRole } from "@/constants/enums";

export interface BaseUser {
  uid: string;
  role: UserRole;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentUser extends BaseUser {
  role: "student";
  name: string;
  studentId: string;
}

export interface VendorUser extends BaseUser {
  role: "vendor";
  ownerName: string;
}

export interface AdminUser extends BaseUser {
  role: "admin";
  name: string;
}

export type User =
  | StudentUser
  | VendorUser
  | AdminUser;
