import { NextResponse } from "next/server";
import { createVendorAuthUser, createVendorProfile } from "@/services/auth/vendor-create";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { shopName?: string; email?: string };
    const { shopName, email } = body;

    if (!shopName || !email) {
      return NextResponse.json({ message: "Missing required fields: shopName and email." }, { status: 400 });
    }

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vendor creation failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

