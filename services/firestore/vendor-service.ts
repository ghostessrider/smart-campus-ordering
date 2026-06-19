import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";


export async function getVendorByEmail(
email:string
){

const q =
query(
collection(db,"vendors"),
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