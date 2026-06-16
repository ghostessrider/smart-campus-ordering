"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  signInStudent,
} from "@/services/auth/google-signin";


export default function StudentLoginPage() {

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();




  const handleGoogleSignIn = async () => {

 setIsLoading(true);

 setError(null);

 try {

   const user =
     await signInStudent();


   console.log(
     "SUCCESS:",
     user.email
   );


   router.push(
     "/student/dashboard"
   );


 }

 catch(err:any){

   setError(
     err.message
   );

 }

 finally{

   setIsLoading(false);

 }

};



  return (

    <main className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">


      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >

        <div className="h-[520px] w-[520px] rounded-full bg-indigo-600/10 blur-[120px]" />

      </div>



      <div className="relative w-full max-w-sm">


        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-8 py-10 shadow-2xl backdrop-blur-sm">



          <div className="mb-6 flex justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/40">


              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >

                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />

              </svg>


            </div>

          </div>




          <h1 className="text-center text-xl font-semibold tracking-tight text-white">

            Smart Campus Ordering

          </h1>



          <p className="mt-1.5 text-center text-sm text-slate-400">

            Sign in with your IIT Bhilai account

          </p>




          <div className="my-7 border-t border-white/[0.06]" />




          <button

            type="button"

            onClick={handleGoogleSignIn}

            disabled={isLoading}

            className="
            group relative flex w-full items-center justify-center gap-3
            rounded-xl border border-white/[0.1] bg-white/[0.05]
            px-4 py-3 text-sm font-medium text-white
            transition-all duration-150
            hover:border-white/[0.2] hover:bg-white/[0.08]
            disabled:cursor-not-allowed disabled:opacity-50
            "

          >


            {isLoading ? (

              <>

                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                >

                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />

                </svg>


                Signing you in...

              </>


            ) : (


              <>

                Continue with Google

              </>


            )}



          </button>





          {error && (

            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm text-red-400">

              {error}

            </div>

          )}



        </div>




        <p className="mt-5 text-center text-xs text-slate-600">

          Access is restricted to

          {" "}

          <span className="text-slate-500">

            @iitbhilai.ac.in

          </span>


          {" "}accounts.

        </p>



      </div>


    </main>

  );

}