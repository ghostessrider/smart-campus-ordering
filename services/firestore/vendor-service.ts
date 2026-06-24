import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";




// STUDENT: get all active vendors

export async function getActiveVendors(){


  const q =
  query(

    collection(
      db,
      "vendors"
    ),


    where(
      "active",
      "==",
      true
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
){


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

  };


}