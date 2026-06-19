import {
 collection,
 getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";


export async function getCanteens(){

 const snapshot =
 await getDocs(
   collection(
    db,
    "canteens"
   )
 );


 return snapshot.docs.map(
  doc=>({
    id:doc.id,
    ...doc.data()
  })
 );

}