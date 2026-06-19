import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";



// STUDENT: create order

export async function createOrder(order:any){


const ref = await addDoc(

collection(db,"orders"),

{

...order,

createdAt: serverTimestamp(),

updatedAt: serverTimestamp()

}

);


return ref.id;


}





// VENDOR: get pending orders

export async function getPendingOrders(
canteenId:string
){


const q = query(

collection(db,"orders"),

where(
"canteenId",
"==",
canteenId
),

where(
"status",
"==",
"pending"
)

);



const snapshot = await getDocs(q);



return snapshot.docs.map(order => ({

id:order.id,

...order.data()

}));



}







// VENDOR: update order status

export async function updateOrderStatus(

orderId:string,

status:string

){


const ref = doc(

db,

"orders",

orderId

);



await updateDoc(

ref,

{

status,

updatedAt:serverTimestamp()

}

);



}