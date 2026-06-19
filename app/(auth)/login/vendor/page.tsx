"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInVendor } from "@/services/auth/vendor-login";


export default function VendorLoginPage(){


const [loading,setLoading] = useState(false);

const [error,setError] = useState("");

const router = useRouter();




async function handleLogin(){


setLoading(true);

setError("");



try{


const vendor =

await signInVendor();



console.log(
"Vendor Login Success:",
vendor
);



router.push(
"/vendor/dashboard"
);



}

catch(err:any){


console.log(
"Vendor Login Error:",
err
);



setError(
err.message
);



}


finally{


setLoading(false);


}


}





return(


<main className="min-h-screen flex items-center justify-center bg-[#0f1117]">


<div className="border rounded-xl p-8">


<h1 className="text-xl text-white mb-5">

Vendor Login

</h1>




<button

onClick={handleLogin}

disabled={loading}

className="border px-5 py-3 rounded text-white"

>


{

loading

?

"Signing in..."

:

"Login with Google"

}



</button>




{

error &&

<p className="mt-4 text-red-400">

{error}

</p>


}




</div>


</main>


)


}