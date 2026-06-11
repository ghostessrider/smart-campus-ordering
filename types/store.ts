export interface Store {
  id: string;
  ownerUid: string;
  storeName: string;
  imageUrl: string;
  relativeLocation: string;
  phoneNumber: string;
  isOpen: boolean;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}
