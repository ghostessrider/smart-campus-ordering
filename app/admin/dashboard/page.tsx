"use client";


import {useEffect,useState} from "react";

import {
getAllOrders,
getAllVendors
}
from "@/services/firestore/admin-service";



export default function AdminDashboard(){


const [orders,setOrders]=useState<any[]>([]);

const [vendors,setVendors]=useState<any[]>([]);



useEffect(()=>{


async function load(){


setOrders(
await getAllOrders()
);


setVendors(
await getAllVendors()
);


}


load();


},[]);



return(


<main className="p-10">


<h1 className="text-3xl font-bold">

Admin Dashboard

</h1>



<h2 className="mt-10 text-xl">

Vendors

</h2>


{

vendors.map(v=>(

<div key={v.id} className="border p-3 mt-3">

{v.name}

</div>


))

}



<h2 className="mt-10 text-xl">

Orders

</h2>



{

orders.map(order=>(


<div

key={order.id}

className="border p-3 mt-3"

>


<p>

Order: {order.id}

</p>


<p>

Status: {order.status}

</p>


<p>

Total: {order.total}

</p>


</div>


))


}



</main>


)


}