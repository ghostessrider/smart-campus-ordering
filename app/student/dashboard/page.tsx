"use client";

import { useEffect, useState } from "react";

import { getMenuItems } from "@/services/firestore/menu-service";
import { createOrder } from "@/services/firestore/order-service";

import {
  addToCart,
  getCart,
  clearCart,
} from "@/services/cart/cart-store";

import { auth } from "@/lib/firebase/auth";


export default function StudentDashboard(){


const [items,setItems] = useState<any[]>([]);

const [cart,setCart] = useState<any[]>([]);

const [message,setMessage] = useState("");



useEffect(()=>{


async function load(){

const data =
await getMenuItems(
"canteen-1"
);


setItems(data);


}


load();


},[]);





function handleAdd(item:any){

console.log(
"ADDING ITEM",
item
);


addToCart({

id:item.id,

name:item.name,

price:Number(item.price),

quantity:1

});


setCart(
[
...getCart()
]
);


}





async function placeOrder(){


const user =
auth.currentUser;



if(!user){

throw new Error(
"User not logged in"
);

}



const currentCart =
getCart();



const order = {


userId:

user.uid,



canteenId:

"canteen-1",



items:

currentCart,



total:

currentCart.reduce(

(sum,item)=>

sum +

item.price *

item.quantity,

0

),



status:

"pending"


};




const id =

await createOrder(order);



console.log(

"Order created:",

id

);




clearCart();



setCart([]);



setMessage(

"Order placed successfully"

);



}





return(


<main className="p-10">



<h1 className="text-3xl font-bold">

Student Dashboard

</h1>




<h2 className="mt-8 text-xl">

Menu

</h2>





<div className="mt-5 space-y-4">



{

items.map(item=>(


<div

key={item.id}

className="border p-5 rounded flex justify-between"

>



<div>


<p>

{item.name}

</p>


<p>

₹{item.price}

</p>



</div>





<button

onClick={()=>

handleAdd(item)

}

className="border px-4 py-2 rounded"

>

Add

</button>




</div>



))


}





</div>





<h2 className="mt-10 text-xl">

Cart

</h2>





{

cart.map(item=>(


<p

key={item.id}

>

{item.name} × {item.quantity}

</p>


))


}






<button


onClick={placeOrder}


className="mt-5 border px-5 py-2 rounded"


>


Place Order


</button>






<p className="mt-5">


{message}


</p>





</main>


)


}