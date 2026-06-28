import { uploadImage } from "@/services/cloudinary/upload-service";


export async function uploadVendorImage(
  vendorId: string,
  file: Blob | File
): Promise<string> {

  return uploadImage(
    file,
    `vendors/${vendorId}`
  );

}



export async function uploadMenuItemImage(
  vendorId: string,
  itemId: string,
  file: Blob | File
): Promise<string> {

  return uploadImage(
    file,
    `menuItems/${vendorId}/${itemId}`
  );

}