import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { Vendor } from "@/types/vendor";




// STUDENT: get all active vendors

export async function getActiveVendors(){


  const q =
  query(

    collection(
      db,
      "vendors"
    ),


    where(
      "status",
      "==",
      "open"
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (vendor)=>({

      id:vendor.id,

      ...vendor.data()

    })
  );


}





// AUTH / VENDOR: get vendor by email

export async function getVendorByEmail(
  email:string
): Promise<Vendor | null> {


  const q =
  query(

    collection(
      db,
      "vendors"
    ),


    where(
      "email",
      "==",
      email
    )

  );



  const snapshot =
  await getDocs(q);



  if(snapshot.empty){

    return null;

  }



  return {

    id:snapshot.docs[0].id,

    ...snapshot.docs[0].data()

  } as Vendor;


}

// VENDOR: toggle own store open/closed.
// Writes to the existing `status` field on the vendor's own doc only —
// does not introduce a separate isOpen flag, to keep one source of truth.
export async function setVendorStoreStatus(
  vendorId: string,
  status: "open" | "closed"
) {
  const ref = doc(db, "vendors", vendorId);
  await updateDoc(ref, { status });
}