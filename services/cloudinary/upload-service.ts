export async function uploadImage(
  file: Blob | File,
  folder: string
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


  if (!response.ok) {
    const errorText = await response.text().catch(() => "Could not read body");
    console.error(`Cloudinary error ${response.status} ${response.statusText}:`, errorText);
    
    let parsed = null;
    try { parsed = JSON.parse(errorText); } catch(e) {}
    
    throw new Error(
      parsed?.error?.message || `Cloudinary upload failed: ${response.status} ${response.statusText}`
    );
  }


  const data =
    await response.json();


  return data.secure_url;

}