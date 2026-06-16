"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";


export default function StudentDashboard() {

  const router = useRouter();

  const [email,setEmail] = useState<string | null>(null);


  useEffect(()=>{

    const user = auth.currentUser;


    if(!user){

      router.push(
        "/login/student"
      );

      return;

    }


    setEmail(
      user.email
    );


  },[router]);



  const logout = async()=>{

    await signOut(auth);

    router.push(
      "/login/student"
    );

  };



  return (

    <main className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center">


      <div className="rounded-xl border border-white/10 bg-white/5 p-8">


        <h1 className="text-2xl font-semibold">
          Student Dashboard
        </h1>


        <p className="mt-3 text-slate-400">
          Logged in as:
        </p>


        <p className="mt-1">
          {email}
        </p>



        <button

          onClick={logout}

          className="mt-6 rounded-lg bg-indigo-600 px-4 py-2"

        >

          Logout

        </button>


      </div>


    </main>

  );

}
