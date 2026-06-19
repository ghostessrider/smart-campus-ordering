import {
 doc,
 getDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";


export async function getUser(
 uid:string
){

 const snapshot =
 await getDoc(
   doc(
    db,
    "users",
    uid
   )
 );


 if(!snapshot.exists()){
   return null;
 }


 return snapshot.data();

}