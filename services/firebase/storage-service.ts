import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/storage";

export async function uploadVendorImage(vendorId: string, file: Blob | File): Promise<string> {
  const path = `vendors/${vendorId}/profile`;
  const r = ref(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return url;
}

export async function uploadMenuItemImage(vendorId: string, itemId: string, file: Blob | File): Promise<string> {
  const path = `menuItems/${vendorId}/${itemId}`;
  const r = ref(storage, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return url;
}
