"use client";

import { useEffect, useState } from "react";

import {
  getPendingOrders,
  updateOrderStatus,
} from "@/services/firestore/order-service";

import {
  getVendorByEmail,
} from "@/services/firestore/vendor-service";

import {
  auth
} from "@/lib/firebase/auth";


type VendorOrderItem = {
  itemId: string;
  name: string;
  quantity: number;
  price?: number;
};

type VendorOrder = {
  id: string;
  vendorId: string;
  status: string;
  items?: VendorOrderItem[];
};

export default function VendorDashboard(){


const [orders,setOrders] =
useState<VendorOrder[]>([]);



const [canteenId,setCanteenId] =
useState("");





async function loadOrders(){


const email =
auth.currentUser?.email;



if(!email){

console.log(
"No vendor logged in"
);

return;

}





const vendor =
await getVendorByEmail(
email
);



if(!vendor){

console.log(
"Vendor not found"
);

return;

}





setCanteenId(vendor.id);


const data =
await getPendingOrders(
vendor.id
);



setOrders(data as VendorOrder[]);



}

useEffect(() => {
  async function init() {
    await loadOrders();
  }

  void init();
}, []);

async function changeStatus(
id: string,
status: string
) {


await updateOrderStatus(
id,
status
);


loadOrders();


}







return(


<main className="p-10">



<h1 className="text-3xl font-bold">

Vendor Dashboard

</h1>




<p className="mt-2">

Vendor ID: {canteenId}

</p>





<div className="mt-8 space-y-5">



{

orders.map(order=>(


<div

key={order.id}

className="border rounded p-5"

>



<h2>

Order ID: {order.id}

</h2>



<p>

Status: {order.status}

</p>





<h3 className="mt-3">

Items

</h3>





{
  order.items?.map((item, index) => (
    <p key={item.itemId || index}>
      {item.name} × {item.quantity}
    </p>
  ))
}




<div className="mt-4 flex gap-3">



<button

onClick={()=>changeStatus(

order.id,

"accepted"

)}

className="border px-4 py-2 rounded"

>

Accept

</button>





<button

onClick={()=>changeStatus(

order.id,

"completed"

)}

className="border px-4 py-2 rounded"

>

Complete

</button>



</div>




</div>


))


}



</div>



</main>


)


}