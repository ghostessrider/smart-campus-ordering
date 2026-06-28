import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";

export async function getAdminByUid(uid: string) {
  const q = query(collection(db, "admins"), where("uid", "==", uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
}

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