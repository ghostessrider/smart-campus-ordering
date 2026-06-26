import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId } = body;

    if (!vendorId) {
      return NextResponse.json({ message: "Missing vendorId." }, { status: 400 });
    }

    const vendorRef = adminDb.collection("vendors").doc(vendorId);
    const vendorSnap = await vendorRef.get();

    if (!vendorSnap.exists) {
      return NextResponse.json({ message: "Vendor not found." }, { status: 404 });
    }

    const vendorData = vendorSnap.data();
    const uid = vendorData?.uid;

    if (uid) {
      try {
        await adminAuth.deleteUser(uid);
      } catch (error: any) {
        if (error.code !== "auth/user-not-found") {
          throw error;
        }
      }
    }

    await vendorRef.delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Vendor deletion failed." }, { status: 500 });
  }
}
