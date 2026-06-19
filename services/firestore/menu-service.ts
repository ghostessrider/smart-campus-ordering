import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";


export async function getMenuItems(
  canteenId:string
) {

  const q = query(
    collection(db,"menus"),
    where(
      "canteenId",
      "==",
      canteenId
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