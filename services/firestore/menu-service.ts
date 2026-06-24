import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";



export async function getMenuItems(
  vendorId:string
){


  const q =
  query(

    collection(
      db,
      "menuItems"
    ),


    where(
      "vendorId",
      "==",
      vendorId
    ),


    where(
      "available",
      "==",
      true
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (doc)=>({

      id:doc.id,

      ...doc.data()

    })
  );


}