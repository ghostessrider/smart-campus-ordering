import { NextResponse } from "next/server";
import { createVendorAuthUser, createVendorProfile } from "@/services/auth/vendor-create";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopName, email } = body;

    if (!shopName || !email) {
      return NextResponse.json({ message: "Missing required fields: shopName and email." }, { status: 400 });
    }

    // Generate a secure temporary password for the vendor
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase();

    const uid = await createVendorAuthUser(email, tempPassword);
    const vendorDoc = await createVendorProfile({
      uid,
      name: shopName,
      email,
      password: "",
      shopName,
      phone: "",
    });

    return NextResponse.json({ vendor: vendorDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Vendor creation failed." }, { status: 500 });
  }
}

