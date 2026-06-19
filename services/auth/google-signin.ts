import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, initAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";


export async function signInStudent() {


  console.log(
    "google button clicked"
  );
   await initAuth();


  const provider =
    new GoogleAuthProvider();



  const result =
    await signInWithPopup(
      auth,
      provider
    );



  const user =
    result.user;



  console.log(
    "Logged in:",
    user.email
  );



  if(
    !user.email?.endsWith(
      "@iitbhilai.ac.in"
    )
  ){

    throw new Error(
      "Only IIT Bhilai accounts allowed."
    );

  }



  const userRef =
    doc(
      db,
      "users",
      user.uid
    );



  const userSnap =
    await getDoc(userRef);



  if(!userSnap.exists()){


    await setDoc(
      userRef,
      {

        uid:user.uid,

        role:"student",

        email:user.email,

        name:user.displayName,

        createdAt:new Date(),

        updatedAt:new Date(),

      }
    );


    console.log(
      "Firestore user created"
    );

  }



  return user;

}