import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";


import { auth } from "@/lib/firebase/auth";

import { db } from "@/lib/firebase/firestore";





export async function signInVendor(){



const provider =
new GoogleAuthProvider();




const result =

await signInWithPopup(

auth,

provider

);




const user =

result.user;




if(!user.email){

throw new Error(
"No email found"
);

}





const q =

query(

collection(db,"vendors"),

where(

"email",

"==",

user.email

)

);






const snapshot =

await getDocs(q);






if(snapshot.empty){


throw new Error(

"Not an approved vendor"

);


}





const vendorData = snapshot.docs[0].data();

const vendor = {
  id: snapshot.docs[0].id,
  ...(vendorData as {
    uid?: string;
    name?: string;
    email?: string;
    phone?: string;
    upiId?: string;
    active?: boolean;
    queueNumber?: number;
  }),
};






if(vendor.active !== true){


throw new Error(

"Vendor account disabled"

);


}






return vendor;



}