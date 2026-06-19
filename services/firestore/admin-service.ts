import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";


export async function getAllOrders(){


const snapshot =
await getDocs(
collection(db,"orders")
);


return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}



export async function getAllVendors(){


const snapshot =
await getDocs(
collection(db,"vendors")
);


return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}