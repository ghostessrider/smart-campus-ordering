export async function uploadImage(
  file: Blob | File,
  folder: string,
  publicId?: string
): Promise<string> {


  const formData = new FormData();


  formData.append(
    "file",
    file
  );


  formData.append(
    "upload_preset",
    process.env
      .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );


  formData.append(
    "folder",
    folder
  );


  if (publicId) {
    formData.append("public_id", publicId);
    formData.append("overwrite", "true");
  }


  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );


  if(!response.ok){

    throw new Error(
      "Cloudinary upload failed"
    );

  }


  const data =
    await response.json();


  return data.secure_url;

}