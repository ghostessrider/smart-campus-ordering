import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";





// STUDENT: create order

export async function createOrder(
  order:any
){


  const ref =
  await addDoc(

    collection(
      db,
      "orders"
    ),


    {


      ...order,


      status:"pending",


      paymentStatus:"pending",


      paymentUTR:null,


      createdAt:
      serverTimestamp(),


      acceptedAt:null,


      completedAt:null,


      deliveredAt:null,


      updatedAt:
      serverTimestamp()


    }

  );



  return ref.id;


}







// STUDENT: get own orders

export async function getStudentOrders(
  userId:string
){


  const q =
  query(

    collection(
      db,
      "orders"
    ),


    where(
      "userId",
      "==",
      userId
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (order)=>({

      id:order.id,

      ...order.data()

    })
  );


}







// VENDOR: get pending orders

export async function getPendingOrders(
  vendorId:string
){


  const q =
  query(

    collection(
      db,
      "orders"
    ),


    where(
      "vendorId",
      "==",
      vendorId
    ),


    where(
      "status",
      "==",
      "pending"
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (order)=>({

      id:order.id,

      ...order.data()

    })
  );


}








// VENDOR: update order status

export async function updateOrderStatus(

  orderId:string,

  status:string

){


  const ref =
  doc(

    db,

    "orders",

    orderId

  );



  const updateData:any = {


    status,


    updatedAt:
    serverTimestamp()


  };



  if(status==="accepted"){


    updateData.acceptedAt =
    serverTimestamp();


  }



  if(status==="completed"){


    updateData.completedAt =
    serverTimestamp();


  }



  if(status==="delivered"){


    updateData.deliveredAt =
    serverTimestamp();


  }




  await updateDoc(

    ref,

    updateData

  );


}