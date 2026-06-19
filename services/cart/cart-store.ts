export type CartItem = {
  id:string;
  name:string;
  price:number;
  quantity:number;
};


let cart:CartItem[] = [];


export function addToCart(
 item:CartItem
){

 const existing =
 cart.find(
  i=>i.id===item.id
 );


 if(existing){

  existing.quantity += 1;

 }
 else{

  cart.push({
    ...item,
    quantity:1
  });

 }


}



export function getCart(){

 return cart;

}



export function clearCart(){

 cart=[];

}