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



export default function VendorDashboard(){


const [orders,setOrders] =
useState<any[]>([]);



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





setCanteenId(
vendor.canteenId
);





const data =
await getPendingOrders(
vendor.canteenId
);



setOrders(data);



}






useEffect(()=>{


loadOrders();


},[]);






async function changeStatus(
id:string,
status:string
){


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

Canteen: {canteenId}

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

order.items?.map(
(item:any,index:number)=>(


<p key={item.id || index}>

{item.name} × {item.quantity}

</p>


)

)



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